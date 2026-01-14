import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styles } from '../styles';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/user/all');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const makeAdmin = async (id) => {
    try {
      await axios.post('http://localhost:3000/user/update-role', { 
        adminId: user.id, 
        targetUserId: id, 
        newRole: 'admin' 
      });
      fetchUsers(); // Listeyi güncelle
    } catch (err) { alert("Yetki verilemedi!"); }
  };

  return (
    <div style={{ width: '100%' }}>
      <h2>Kullanıcı Yönetimi</h2>
      {users.map(u => (
        <div key={u.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><b>{u.firstName} {u.lastName}</b> ({u.role})</span>
          {u.role !== 'admin' && (
            <button onClick={() => makeAdmin(u.id)} style={{ ...styles.btn, backgroundColor: '#ffc107', color: 'black' }}>Admin Yap</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;