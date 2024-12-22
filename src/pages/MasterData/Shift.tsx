import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Shift {
  shift_id: number;
  shift_name: string;
  time_in: string;
  time_out: string;
}

const API_BASE_URL = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/shifts/';

const ShiftPage: React.FC = () => {
  const [shiftList, setShiftList] = useState<Shift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    shift_name: '',
    time_in: '',
    time_out: '',
  });
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    setIsLoading(true); // Tampilkan loading sebelum mengambil data
    try {
      const response = await axios.get<Shift[]>(API_BASE_URL);

      // Simulasikan loading selama 2 detik
      setTimeout(() => {
        setShiftList(response.data);
        setIsLoading(false); // Sembunyikan loading setelah data selesai diambil
      }, 2000);
    } catch (error) {
      console.error('Gagal mengambil data shift:', error);
      setIsLoading(false); // Sembunyikan loading jika terjadi error
    }
  };

  const openModal = (shift: Shift | null = null) => {
    setEditingShift(shift);
    if (shift) {
      setFormFields({
        shift_name: shift.shift_name,
        time_in: shift.time_in,
        time_out: shift.time_out,
      });
    } else {
      setFormFields({ shift_name: '', time_in: '', time_out: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShift(null);
    setFormFields({ shift_name: '', time_in: '', time_out: '' });
  };

  const validateForm = () => {
    const { shift_name, time_in, time_out } = formFields;
    if (!shift_name || !time_in || !time_out) {
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
    if (!validateForm()) return;

    try {
      const shiftData = {
        shift_name: formFields.shift_name,
        time_in: formFields.time_in,
        time_out: formFields.time_out,
      };

      if (editingShift) {
        await axios.put(`${API_BASE_URL}${editingShift.shift_id}`, shiftData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post(API_BASE_URL, shiftData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      fetchShifts();
      closeModal();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Shift berhasil disimpan!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Gagal menyimpan shift:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan shift.',
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
          fetchShifts();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Shift berhasil dihapus!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Gagal menghapus shift:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus shift.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Shift</h1>
      <button onClick={() => openModal()} className="btn btn-success mb-4">
            Tambah Shift Baru
          </button>
      {/* Tampilkan loading jika data belum selesai diambil */}
      {isLoading ? (
        <div className="text-center">
          <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 mx-auto animate-spin"></div>
          <p className="mt-4 text-gray-600">Mengambil data...</p>
        </div>
      ) : (
        <>
          

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Nama Shift</th>
                <th className="border border-gray-300 px-4 py-2">Jam Masuk</th>
                <th className="border border-gray-300 px-4 py-2">Jam Keluar</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {shiftList.map((shift) => (
                <tr key={shift.shift_id}>
                  <td className="border border-gray-300 px-4 py-2">{shift.shift_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{shift.time_in}</td>
                  <td className="border border-gray-300 px-4 py-2">{shift.time_out}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button onClick={() => openModal(shift)} className="btn btn-primary mx-1">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(shift.shift_id)} className="btn btn-danger mx-1">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                  {editingShift ? 'Edit Shift' : 'Tambah Shift Baru'}
                </Dialog.Title>
                <div className="mt-4">
                  <label className="block font-bold">Nama Shift</label>
                  <input
                    type="text"
                    value={formFields.shift_name}
                    onChange={(e) => setFormFields({ ...formFields, shift_name: e.target.value })}
                    className="form-input mt-2 w-full"
                  />
                  <label className="block font-bold mt-4">Jam Masuk</label>
                  <input
                    type="time"
                    value={formFields.time_in}
                    onChange={(e) => setFormFields({ ...formFields, time_in: e.target.value })}
                    className="form-input mt-2 w-full"
                  />
                  <label className="block font-bold mt-4">Jam Keluar</label>
                  <input
                    type="time"
                    value={formFields.time_out}
                    onChange={(e) => setFormFields({ ...formFields, time_out: e.target.value })}
                    className="form-input mt-2 w-full"
                  />
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Batal
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    {editingShift ? 'Perbarui' : 'Simpan'}
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

export default ShiftPage;
