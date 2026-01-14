import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

const NewPost = ({ user }) => {
  const [post, setPost] = useState({ title: '', content: '' });
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/category/all').then(res => setCategories(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { 
      title: post.title,
      content: post.content,
      author: Number(user.id),
      categories: selectedCats.map(id => Number(id))
    };
    await axios.post('http://localhost:3000/post/create', payload);
    navigate('/');
  };

  return (
    <div style={{ width: '100%' }}>
      <h2>Yeni Yazı Paylaş</h2>
      <form onSubmit={handleCreate} style={styles.card}>
        <input placeholder="Başlık" onChange={e => setPost({ ...post, title: e.target.value })} style={styles.input} required />
        <textarea placeholder="İçerik..." onChange={e => setPost({ ...post, content: e.target.value })} style={{ ...styles.input, height: '150px' }} required></textarea>
        <div>
          <p>Kategori Seç:</p>
          {categories.map(c => (
            <label key={c.id} style={{ marginRight: '15px' }}>
              <input type="checkbox" onChange={() => setSelectedCats(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} /> {c.name}
            </label>
          ))}
        </div>
        <button type="submit" style={{ ...styles.btn, width: '100%', marginTop: '20px' }}>Yayınla</button>
      </form>
    </div>
  );
};

export default NewPost;