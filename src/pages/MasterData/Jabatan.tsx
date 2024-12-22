import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Position {
  position_id: number;
  position_name: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/positions/';

const JabatanPage: React.FC = () => {
  const [positionList, setPositionList] = useState<Position[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    position_name: '',
  });
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setIsLoading(true); // Tampilkan loading
    try {
      const response = await axios.get<Position[]>(API_BASE_URL);
      setTimeout(() => {
        setPositionList(response.data);
        setIsLoading(false); // Sembunyikan loading
      }, 2000);
    } catch (error) {
      console.error('Gagal mengambil data posisi:', error);
      setIsLoading(false); // Sembunyikan loading jika terjadi error
    }
  };

  const openModal = (position: Position | null = null) => {
    setEditingPosition(position);
    if (position) {
      setFormFields({
        position_name: position.position_name,
      });
    } else {
      setFormFields({ position_name: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPosition(null);
    setFormFields({ position_name: '' });
  };

  const validateForm = () => {
    const { position_name } = formFields;
    if (!position_name) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama Jabatan harus diisi!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const positionData = {
        position_name: formFields.position_name,
      };

      if (editingPosition) {
        await axios.put(`${API_BASE_URL}${editingPosition.position_id}`, positionData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(API_BASE_URL, positionData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      fetchPositions();
      closeModal();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data jabatan berhasil disimpan!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Gagal menyimpan jabatan:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan data jabatan.',
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
          await axios.delete(`${API_BASE_URL}${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          fetchPositions();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data jabatan berhasil dihapus!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Gagal menghapus jabatan:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus data jabatan.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Jabatan</h1>
      <button
        onClick={() => openModal()}
        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 mb-4"
      >
        Tambah Jabatan Baru
      </button>

      {isLoading ? (
        <div className="text-center">
          <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 mx-auto animate-spin"></div>
          <p className="mt-4 text-gray-600">Mengambil data...</p>
        </div>
      ) : (
        <>
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama Jabatan</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {positionList.map((position, index) => (
              <tr key={position.position_id}>
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{position.position_id}</td>
                <td className="border border-gray-300 px-4 py-2">{position.position_name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => openModal(position)}
                    className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700 mx-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(position.position_id)}
                    className="bg-red-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-700 mx-1"
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                  {editingPosition ? 'Edit Jabatan' : 'Tambah Jabatan Baru'}
                </Dialog.Title>
                <div className="mt-4">
                  <label className="block font-bold">Nama Jabatan</label>
                  <input
                    type="text"
                    value={formFields.position_name}
                    onChange={(e) =>
                      setFormFields({ ...formFields, position_name: e.target.value })
                    }
                    className="form-input mt-2 w-full"
                  />
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" className="bg-gray-600 text-white py-2 px-6 rounded-lg" onClick={closeModal}>
                    Batal
                  </button>
                  <button type="button" className="bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={handleSave}>
                    {editingPosition ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default JabatanPage;
