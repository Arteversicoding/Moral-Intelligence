// Using global Supabase client from CDN
const supabase = window.supabaseClient;

export class MaterialsService {
    static BUCKET_NAME = 'materials';
    static TABLE_NAME = 'materials';

    static async uploadFile(file, path = '') {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = path ? `${path}/${fileName}` : fileName;

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(filePath);

            // Save to database
            const materialData = {
                title: file.name,
                description: '',
                file_path: filePath,
                file_url: publicUrl,
                file_type: file.type,
                file_size: file.size,
                user_id: user.id
            };

            const { data, error: dbError } = await supabase
                .from(this.TABLE_NAME)
                .insert([materialData])
                .select()
                .single();

            if (dbError) throw dbError;
            return data;

        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw error;
        }
    }

    static async getMaterials(searchTerm = '') {
        try {
            let query = supabase
                .from(this.TABLE_NAME)
                .select('*')
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting materials:', error);
            throw error;
        }
    }

    static async getMaterialById(id) {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting material by ID:', error);
            throw error;
        }
    }

    static async updateMaterial(id, updates) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Only allow updating certain fields
            const allowedUpdates = ['title', 'description', 'is_featured', 'category'];
            const validUpdates = Object.keys(updates)
                .filter(key => allowedUpdates.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updates[key];
                    return obj;
                }, {});

            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .update(validUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating material:', error);
            throw error;
        }
    }

    static async deleteMaterial(id) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Get material first to check ownership
            const { data: material, error: fetchError } = await supabase
                .from(this.TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            // Check if user is the owner or admin
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (material.user_id !== currentUser.id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', currentUser.id)
                    .single();
                
                if (!profile?.is_admin) {
                    throw new Error('Unauthorized: You can only delete your own materials');
                }
            }

            // Delete file from storage if it exists
            if (material.file_path) {
                const { error: deleteError } = await supabase.storage
                    .from(this.BUCKET_NAME)
                    .remove([material.file_path]);

                if (deleteError) {
                    console.warn('Error deleting file from storage:', deleteError);
                }
            }

            // Delete from database
            const { error: deleteError } = await supabase
                .from(this.TABLE_NAME)
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return true;
        } catch (error) {
            console.error('Error deleting material:', error);
            throw error;
        }
    }

    static async getMaterialsByUser(userId) {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting user materials:', error);
            throw error;
        }
    }
}