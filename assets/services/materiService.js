import { supabase } from '../supabase-config';

const BUCKET_NAME = 'materi';

export const uploadFile = async (file, metadata) => {
  try {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${BUCKET_NAME}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // 3. Save metadata to database
    const { data, error } = await supabase
      .from('materi')
      .insert([
        { 
          judul: metadata.judul,
          deskripsi: metadata.deskripsi,
          nama_file: file.name,
          url_file: publicUrl,
          tipe_file: file.type,
          ukuran_file: file.size
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const updateMateri = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('materi')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating materi:', error);
    throw error;
  }
};

export const deleteMateri = async (id, filePath) => {
  try {
    // 1. Delete file from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) throw storageError;

    // 2. Delete record from database
    const { error } = await supabase
      .from('materi')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting materi:', error);
    throw error;
  }
};

export const getAllMateri = async () => {
  try {
    const { data, error } = await supabase
      .from('materi')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching materi:', error);
    throw error;
  }
};
