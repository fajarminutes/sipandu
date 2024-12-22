import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Location {
  address: string;
  code: string;
  latitude_longtitude: string;
  name: string;
  radius: number;
  customer_id: number;
}

const API_BASE_URL = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/customers/';

const LokasiPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreate = searchParams.has('create');
  const isEdit = searchParams.get('edit') || null;
  const [formFields, setFormFields] = useState({
    address: '',
    code: '',
    latitude: '',
    longitude: '',
    name: '',
    radius: 0,
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    if (isCreate) {
      resetFormFields();
    } else if (isEdit) {
      fetchCustomerData(isEdit);
    } else {
      fetchLocations();
    }
  }, [isCreate, isEdit]);

  const resetFormFields = () => {
    setFormFields({
      address: '',
      code: '',
      latitude: '',
      longitude: '',
      name: '',
      radius: 0,
    });
  };

  const fetchLocations = async () => {
    setIsLoading(true); // Tampilkan loading
    try {
      const response = await axios.get<Location[]>(API_BASE_URL);

      // Simulasikan loading 2 detik
      setTimeout(() => {
        const sortedLocations = response.data.sort((a, b) => b.customer_id - a.customer_id);
        setLocations(sortedLocations);
        setIsLoading(false); // Sembunyikan loading
      }, 2000);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setIsLoading(false); // Sembunyikan loading jika terjadi error
    }
  };

  const fetchCustomerData = async (id: string) => {
    setIsLoading(true); // Tampilkan loading
    try {
      const response = await axios.get<Location>(`${API_BASE_URL}${id}`);
      const data = response.data;
      const [lat, lng] = data.latitude_longtitude.split(',').map(String);
      setFormFields({
        address: data.address,
        code: data.code,
        latitude: lat,
        longitude: lng,
        name: data.name,
        radius: data.radius,
      });
      setIsLoading(false); // Sembunyikan loading
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setIsLoading(false); // Sembunyikan loading jika terjadi error
    }
  };

  const validateForm = () => {
    const { address, code, latitude, longitude, name, radius } = formFields;
    if (!address || !code || !latitude || !longitude || !name || !radius) {
      Swal.fire({
        title: 'Error!',
        text: 'Semua kolom harus diisi!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Lakukan validasi

    try {
      const locationData = {
        address: formFields.address,
        code: formFields.code,
        latitude_longtitude: `${formFields.latitude},${formFields.longitude}`,
        name: formFields.name,
        radius: formFields.radius,
      };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}${isEdit}`, locationData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(API_BASE_URL, locationData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data lokasi berhasil disimpan!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/master-data/lokasi');
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan data lokasi.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data ini tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}${id}`);
          fetchLocations();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data lokasi berhasil dihapus!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Error deleting location:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus data lokasi.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      {isCreate || isEdit ? (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            {isEdit ? 'Edit Lokasi' : 'Tambah Lokasi'}
          </h1>
          <form className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Nama Lokasi</label>
              <input
                type="text"
                value={formFields.name}
                onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lokasi"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Alamat Lokasi</label>
              <textarea
                value={formFields.address}
                onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan alamat lokasi"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="text"
                  value={formFields.latitude}
                  onChange={(e) => setFormFields({ ...formFields, latitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan latitude"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="text"
                  value={formFields.longitude}
                  onChange={(e) => setFormFields({ ...formFields, longitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan longitude"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Radius</label>
              <input
                type="number"
                value={formFields.radius}
                onChange={(e) => setFormFields({ ...formFields, radius: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan radius"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isEdit ? 'Perbarui' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/master-data/lokasi')}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
            <>
            <h1 className="text-2xl font-bold mb-6">Daftar Lokasi</h1>
              <button
                onClick={() => navigate('?create')}
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Tambah Lokasi Baru
              </button>
            </>
             
          {isLoading ? (
            <div className="text-center">
              <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 mx-auto animate-spin"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <>
              <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">No</th>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Nama Lokasi</th>
                    <th className="border border-gray-300 px-4 py-2">Alamat</th>
                    <th className="border border-gray-300 px-4 py-2">Radius</th>
                    <th className="border border-gray-300 px-4 py-2">Jumlah Karyawan</th>
                    <th className="border border-gray-300 px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, index) => (
                    <tr key={location.customer_id}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.customer_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.address}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{location.radius}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                      <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`?edit=${location.customer_id}`)}
                          className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(location.customer_id)}
                          className="bg-red-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
  
  
};

export default LokasiPage;
