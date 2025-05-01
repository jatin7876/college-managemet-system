import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, ChevronDown, ChevronUp, UserCheck, UserX, Users } from 'lucide-react';
import {io} from 'socket.io-client';
import { useNavigate } from 'react-router';
const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0 });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });
    const navigate = useNavigate();
  const sessionSto = () => {
  sessionStorage.removeItem('isLoggedIn');
  navigate('/login')
  
  }
  useEffect(() => {

    fetchUsers();
  }, []);
 function deleteuser(email){
    const socket = io('http://localhost:3000/admin');
    socket.emit('deleteuser', email );
    socket.on('userdeleted', (data) => {
      console.log(data)
      if (data.success) {
        setStudents((prev) => prev.filter((user) => user.email !== email));
        setStaff((prev) => prev.filter((user) => user.email !== email));
        setStats((prev) => ({
          ...prev,
          totalStudents: prev.totalStudents - 1,
          totalStaff: prev.totalStaff - 1
        }));
      } else {
        setError(data.message || 'Failed to delete user');
      }
    });
    socket.on('error', (err) => {
      setError('Server error: ' + err.message);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
 }
 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        const studentList = data.users.filter((user) => user.role === 'student');
        const staffList = data.users.filter((user) => user.role === 'staff');
        setStudents(studentList);
        setStaff(staffList);
        setStats({
          totalStudents: studentList.length,
          totalStaff: staffList.length
        });
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredStudents = sortedData(students).filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = sortedData(staff).filter(staffMember => 
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staffMember.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Mock function for demonstration purposes
  const handleAddUser = () => {
    console.log("Adding user:", newUser);
    
    // In a real app, you would send this data to your API
    // For demonstration, we'll just add it to the local state
    if (newUser.role === 'student') {
      setStudents(prev => [...prev, newUser]);
      setStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
    } else {
      setStaff(prev => [...prev, newUser]);
      setStats(prev => ({ ...prev, totalStaff: prev.totalStaff + 1 }));
    }
    
    // Reset form and close modal
    setNewUser({ name: '', email: '', role: 'student' });
    setShowAddUserModal(false);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const renderStatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <Users size={24} className="text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-2xl font-bold">{stats.totalStudents + stats.totalStaff}</h3>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <UserCheck size={24} className="text-green-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Students</p>
          <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className="rounded-full bg-purple-100 p-3 mr-4">
          <UserX size={24} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Staff</p>
          <h3 className="text-2xl font-bold">{stats.totalStaff}</h3>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="font-bold mb-1">Quick Actions</h3>
       
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex border-b mb-6">
      <button
        className={`px-6 py-3 font-medium ${
          activeTab === 'students'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('students')}
      >
        Students
      </button>
      <button
        className={`px-6 py-3 font-medium ${
          activeTab === 'staff'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('staff')}
      >
        Staff
      </button>
    </div>
  );

  const renderSearchAndActions = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <UserPlus size={16} className="mr-2" />
          Add User
        </button>
      </div>
    </div>
  );

  const renderTable = (data) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th 
              className="py-3 px-6 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Name {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="py-3 px-6 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                Email {getSortIcon('email')}
              </div>
            </th>
            <th 
              className="py-3 px-6 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center">
                Role {getSortIcon('role')}
              </div>
            </th>
            <th className="py-3 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-6 px-6 text-center text-gray-500">
                No users found matching your search criteria.
              </td>
            </tr>
          ) : (
            data.map((user) => (
              <tr
                key={user.email}
                className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
              >
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'student' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  
                  <button className="text-red-600 hover:underline" onClick={()=>deleteuser(user.email)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const AddUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300" 
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300" 
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select 
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    return (
      <>
        {renderSearchAndActions()}
        {activeTab === 'students' ? renderTable(filteredStudents) : renderTable(filteredStaff)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={sessionSto} className="bg-blue-100 text-blue-800 text-md font-medium px-2.5 py-1 rounded">LogOut</button>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">Admin</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {renderStatCards()}
        {renderTabs()}
        {renderContent()}
      </main>
      
      {showAddUserModal && <AddUserModal />}
    </div>
  );
};

export default AdminDashboard;