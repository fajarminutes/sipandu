import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  employees_nip: string;
  employees_name: string;
  employees_email: string;
  position_id: number;
  shift_id: number;
  id_area_patroli: number | null;
  photo: string | null;
}

interface Shift {
  shift_id: number;
  shift_name: string;
}

interface Position {
  position_id: number;
  position_name: string;
}

interface Penempatan {
  customer_id: number;
  name: string;
}

const API_EMPLOYEES = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/employees/';
const API_SHIFTS = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/shifts/';
const API_POSITIONS = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/positions/';
const API_CUSTOMERS = 'https://sipandu.sinarjernihsuksesindo.biz.id/api/customers/';

const EmployeesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreate = searchParams.has('create');
  const isEdit = searchParams.get('edit') || null;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [penempatan, setPenempatan] = useState<Penempatan[]>([]);
  const [formFields, setFormFields] = useState({
    employees_nip: '',
    employees_name: '',
    employees_email: '',
    password: '',
    position_id: 0,
    shift_id: 0,
    id_area_patroli: 0,
    photo: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
    fetchPositions();
    fetchPenempatan();

    if (isCreate) {
      resetFormFields();
    } else if (isEdit) {
      fetchEmployeeData(isEdit);
    }
  }, [isCreate, isEdit]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Employee[]>(API_EMPLOYEES);
      setEmployees(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Gagal mengambil data karyawan:', error);
      setIsLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get<Shift[]>(API_SHIFTS);
      setShifts(response.data);
    } catch (error) {
      console.error('Gagal mengambil data shift:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get<Position[]>(API_POSITIONS);
      setPositions(response.data);
    } catch (error) {
      console.error('Gagal mengambil data jabatan:', error);
    }
  };

  const fetchPenempatan = async () => {
    try {
      const response = await axios.get<Penempatan[]>(API_CUSTOMERS);
      setPenempatan(response.data);
    } catch (error) {
      console.error('Gagal mengambil data penempatan:', error);
    }
  };

  const fetchEmployeeData = async (id: string) => {
    try {
      const response = await axios.get<Employee>(`${API_EMPLOYEES}${id}`);
      const employee = response.data;
      setFormFields({
        employees_nip: employee.employees_nip,
        employees_name: employee.employees_name,
        employees_email: employee.employees_email,
        password: '',
        position_id: employee.position_id,
        shift_id: employee.shift_id,
        id_area_patroli: employee.id_area_patroli || 0,
        photo: null,
      });
    } catch (error) {
      console.error('Gagal mengambil data karyawan:', error);
    }
  };

  const resetFormFields = () => {
    setFormFields({
      employees_nip: '',
      employees_name: '',
      employees_email: '',
      password: '',
      position_id: 0,
      shift_id: 0,
      id_area_patroli: 0,
      photo: null,
    });
  };

  const validateForm = () => {
    const { employees_nip, employees_name, employees_email, position_id, shift_id, id_area_patroli } = formFields;
    if (!employees_nip || !employees_name || !employees_email || !position_id || !shift_id || !id_area_patroli) {
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

    const formData = new FormData();
    formData.append('employees_nip', formFields.employees_nip);
    formData.append('employees_name', formFields.employees_name);
    formData.append('employees_email', formFields.employees_email);
    if (formFields.password) formData.append('password', formFields.password);
    formData.append('position_id', formFields.position_id.toString());
    formData.append('shift_id', formFields.shift_id.toString());
    formData.append('id_area_patroli', formFields.id_area_patroli.toString());
    if (formFields.photo) formData.append('photo', formFields.photo);

    try {
      if (isEdit) {
        await axios.put(`${API_EMPLOYEES}${isEdit}`, formData);
      } else {
        await axios.post(API_EMPLOYEES, formData);
      }

      fetchEmployees();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data karyawan berhasil disimpan!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/master-data/employees');
    } catch (error) {
      console.error('Gagal menyimpan data karyawan:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan data karyawan.',
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
          await axios.delete(`${API_EMPLOYEES}${id}`);
          fetchEmployees();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data karyawan berhasil dihapus!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Gagal menghapus data karyawan:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus data karyawan.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Karyawan</h1>
      <button
        onClick={() => navigate('?create')}
        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 mb-4"
      >
        Tambah Karyawan Baru
      </button>

      {isLoading ? (
        <div className="text-center">
          <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 mx-auto animate-spin"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">NIP</th>
              <th className="border border-gray-300 px-4 py-2">Nama</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Jabatan</th>
              <th className="border border-gray-300 px-4 py-2">Shift</th>
              <th className="border border-gray-300 px-4 py-2">Penempatan</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border border-gray-300 px-4 py-2">{employee.employees_nip}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.employees_name}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.employees_email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {positions.find((p) => p.position_id === employee.position_id)?.position_name || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {shifts.find((s) => s.shift_id === employee.shift_id)?.shift_name || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {penempatan.find((p) => p.customer_id === employee.id_area_patroli)?.name || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => navigate(`?edit=${employee.id}`)}
                    className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isCreate || isEdit ? (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-6">
          <h2 className="text-xl font-bold text-center mb-4">
            {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block font-bold">NIP</label>
              <input
                type="text"
                value={formFields.employees_nip}
                onChange={(e) => setFormFields({ ...formFields, employees_nip: e.target.value })}
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-bold">Nama</label>
              <input
                type="text"
                value={formFields.employees_name}
                onChange={(e) => setFormFields({ ...formFields, employees_name: e.target.value })}
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-bold">Email</label>
              <input
                type="email"
                value={formFields.employees_email}
                onChange={(e) => setFormFields({ ...formFields, employees_email: e.target.value })}
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-bold">Password</label>
              <input
                type="password"
                value={formFields.password}
                onChange={(e) => setFormFields({ ...formFields, password: e.target.value })}
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-bold">Jabatan</label>
              <select
                value={formFields.position_id}
                onChange={(e) =>
                  setFormFields({ ...formFields, position_id: Number(e.target.value) })
                }
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">- Pilih Jabatan -</option>
                {positions.map((position) => (
                  <option key={position.position_id} value={position.position_id}>
                    {position.position_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold">Shift</label>
              <select
                value={formFields.shift_id}
                onChange={(e) =>
                  setFormFields({ ...formFields, shift_id: Number(e.target.value) })
                }
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">- Pilih Shift -</option>
                {shifts.map((shift) => (
                  <option key={shift.shift_id} value={shift.shift_id}>
                    {shift.shift_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold">Penempatan</label>
              <select
                value={formFields.id_area_patroli}
                onChange={(e) =>
                  setFormFields({ ...formFields, id_area_patroli: Number(e.target.value) })
                }
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">- Pilih Penempatan -</option>
                {penempatan.map((area) => (
                  <option key={area.customer_id} value={area.customer_id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold">Foto</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    photo: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="form-input w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/master-data/employees')}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                {isEdit ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeesPage;
