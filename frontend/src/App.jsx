import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';

// --- TASARIM SİSTEMİ (CSS-in-JS) ---
const styles = {
  wrapper: { 
    backgroundColor: '#121212', 
    minHeight: '100vh', 
    width: '100vw', 
    color: 'white', 
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'hidden'
  },
  container: { 
    width: '100%', 
    maxWidth: '800px', 
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column'
  },
  nav: { 
    display: 'flex', 
    gap: '20px', 
    padding: '25px 0', 
    borderBottom: '1px solid #333', 
    marginBottom: '30px', 
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' },
  input: { 
    width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '8px', 
    border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white', boxSizing: 'border-box' 
  },
  btn: { 
    padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' 
  },
  card: { 
    border: '1px solid #333', padding: '25px', margin: '20px 0', borderRadius: '16px', 
    backgroundColor: '#1e1e1e', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
    width: '100%', boxSizing: 'border-box', overflowWrap: 'anywhere' 
  },
  badge: { 
    fontSize: '11px', color: '#007bff', background: '#007bff15', padding: '4px 12px', 
    borderRadius: '20px', border: '1px solid #007bff44' 
  },
  likeBtn: { 
    backgroundColor: '#e0245e15', color: '#e0245e', border: '1px solid #e0245e44', 
    padding: '8px 18px', borderRadius: '25px', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '8px', fontWeight: 'bold' 
  }
};

// --- BİLEŞENLER ---

// 1. ANA SAYFA (BLOG AKIŞI)
const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/post/all');
      setPosts(res.data);
    } catch (e) { console.error("Veri çekme hatası:", e); }
  };
  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (postId) => {
    if (!user) return alert("Beğenmek için giriş yapmalısın kanka!");
    await axios.post('http://localhost:3000/like/toggle', { postId, userId: user.id });
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bu yazıyı siliyoruz, emin misin?")) return;
    try {
      await axios.post(`http://localhost:3000/post/delete/${id}`, { userId: user.id, userRole: user.role });
      fetchPosts();
    } catch (e) { alert("Sadece kendi yazını veya adminsen silebilirsin!"); }
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>Son Paylaşılanlar</h2>
      {posts.length === 0 && <p style={{color: '#666'}}>Henüz yazı paylaşılmamış...</p>}
      {posts.map(p => (
        <div key={p.id} style={styles.card}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{p.title}</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
            {p.categories?.map(c => <span key={c.id} style={styles.badge}>#{c.name}</span>)}
          </div>
          <p style={{ lineHeight: '1.8', color: '#ccc', fontSize: '16px' }}>{p.content}</p>
          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => handleLike(p.id)} style={styles.likeBtn}>❤️ {p.likes?.length || 0}</button>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <small style={{ color: '#777' }}>Yazar: <b style={{ color: '#007bff' }}>{p.author?.firstName}</b></small>
              {user?.id === p.author?.id && <Link to={`/edit-post/${p.id}`} style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>DÜZENLE</Link>}
              {(user?.role === 'admin' || user?.id === p.author?.id) && <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>SİL</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 2. YENİ YAZI PAYLAŞMA
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
  if (!user || !user.id) return alert("Önce giriş yapmalısın!");
  
  try {
    const payload = { 
      title: post.title,
      content: post.content,
      author: Number(user.id), // ID'nin sayı olduğundan emin ol
      categories: selectedCats.map(id => Number(id)) // Kategori ID'lerini sayı yap
    };
    
    await axios.post('http://localhost:3000/post/create', payload);
    alert("Yazı başarıyla yayınlandı!");
    navigate('/');
  } catch (err) {
    console.error("Hata Detayı:", err.response?.data || err.message);
    alert("Hata: " + (err.response?.data?.message || "Sunucu hatası oluştu!"));
  }
};

  return (
    <div style={{ width: '100%' }}>
      <h2>Yeni Yazı Paylaş</h2>
      <form onSubmit={handleCreate} style={styles.card}>
        <input placeholder="Başlık" onChange={e => setPost({...post, title: e.target.value})} style={styles.input} required />
        <textarea placeholder="İçerik..." onChange={e => setPost({...post, content: e.target.value})} style={{...styles.input, height: '150px'}} required></textarea>
        <div style={{ marginBottom: '20px' }}>
          <p style={{marginBottom: '10px'}}>Kategori Seç (Postman ile eklediklerin burada çıkar):</p>
          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            {categories.map(c => (
              <label key={c.id} style={{ cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" onChange={() => setSelectedCats(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} /> {c.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" style={{...styles.btn, width: '100%'}}>Yayınla</button>
      </form>
    </div>
  );
};

// 3. YAZI DÜZENLEME
const EditPost = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/post/all').then(res => {
      const found = res.data.find(p => p.id === parseInt(id));
      if (found) setPost({ title: found.title, content: found.content });
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/post/update/${id}`, { 
        userId: user.id, 
        postData: post 
      });
      navigate('/');
    } catch (err) { alert("Güncellenemedi!"); }
  };

  return (
    <div style={{ width: '100%' }}>
      <h2>Yazıyı Düzenle</h2>
      <form onSubmit={handleUpdate} style={styles.card}>
        <input value={post.title} onChange={e => setPost({...post, title: e.target.value})} style={styles.input} />
        <textarea value={post.content} onChange={e => setPost({...post, content: e.target.value})} style={{...styles.input, height: '150px'}}></textarea>
        <button type="submit" style={{...styles.btn, width: '100%', backgroundColor: '#ffc107', color: 'black'}}>Değişiklikleri Kaydet</button>
      </form>
    </div>
  );
};

// 4. KATEGORİLER VE DETAY
const Categories = () => {
  const [cats, setCats] = useState([]);
  useEffect(() => { axios.get('http://localhost:3000/category/all').then(res => setCats(res.data)); }, []);
  return (
    <div style={{ width: '100%' }}>
      <h2>Kategoriler</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {cats.map(c => (
          <Link key={c.id} to={`/category/${c.id}`} style={{ ...styles.card, textDecoration: 'none', color: 'white', textAlign: 'center', margin: 0 }}>
            <h3 style={{ color: '#007bff', margin: 0 }}>{c.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CategoryDetail = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  useEffect(() => { axios.get(`http://localhost:3000/post/by-category/${id}`).then(res => setPosts(res.data)); }, [id]);
  return (
    <div style={{ width: '100%' }}>
      <h2>Kategori Sonuçları</h2>
      {posts.map(p => ( <div key={p.id} style={styles.card}><h3>{p.title}</h3><p>{p.content}</p></div> ))}
      <Link to="/categories" style={styles.link}>← Geri Dön</Link>
    </div>
  );
};

// 5. GİRİŞ VE KAYIT
const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();
  const handleRegister = async (e) => { e.preventDefault(); await axios.post('http://localhost:3000/user/register', formData); navigate('/login'); };
  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
      <form onSubmit={handleRegister} style={styles.card}><h2>Kayıt Ol</h2><input placeholder="Ad" onChange={e => setFormData({...formData, firstName: e.target.value})} style={styles.input} required /><input placeholder="Soyad" onChange={e => setFormData({...formData, lastName: e.target.value})} style={styles.input} required /><input type="email" placeholder="E-posta" onChange={e => setFormData({...formData, email: e.target.value})} style={styles.input} required /><input type="password" placeholder="Şifre" onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} required /><button type="submit" style={{...styles.btn, width: '100%'}}>Hesap Oluştur</button></form>
    </div>
  );
};

const Login = ({ setUser }) => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const navigate = useNavigate();
  const handleLogin = async (e) => { e.preventDefault(); const res = await axios.post('http://localhost:3000/user/login', { email, password }); localStorage.setItem('user', JSON.stringify(res.data)); setUser(res.data); navigate('/'); };
  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
      <form onSubmit={handleLogin} style={styles.card}><h2>Giriş Yap</h2><input type="email" placeholder="E-posta" onChange={e => setEmail(e.target.value)} style={styles.input} required /><input type="password" placeholder="Şifre" onChange={e => setPassword(e.target.value)} style={styles.input} required /><button type="submit" style={{...styles.btn, width: '100%'}}>Giriş</button></form>
    </div>
  );
};

// 6. ADMIN PANELİ
const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => { const res = await axios.get('http://localhost:3000/user/all'); setUsers(res.data); };
  useEffect(() => { fetchUsers(); }, []);
  const makeAdmin = async (id) => { await axios.post('http://localhost:3000/user/update-role', { adminId: user.id, targetUserId: id, newRole: 'admin' }); fetchUsers(); };
  return (
    <div style={{ width: '100%' }}><h2>Kullanıcı Yönetimi</h2>{users.map(u => ( <div key={u.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span><b>{u.firstName} {u.lastName}</b> ({u.role})</span>{u.role !== 'admin' && <button onClick={() => makeAdmin(u.id)} style={{...styles.btn, backgroundColor: '#ffc107', color: 'black'}}>Admin Yap</button>}</div> ))}</div>
  );
};

// --- ANA UYGULAMA YAPISI (ROUTING) ---
export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <Router>
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Ana Sayfa</Link>
            <Link to="/categories" style={styles.link}>Kategoriler</Link>
            {user && <Link to="/new-post" style={{...styles.link, color: '#28a745'}}>+ Yazı Paylaş</Link>}
            {!user ? (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                <Link to="/login" style={styles.link}>Giriş</Link>
                <Link to="/register" style={styles.link}>Kayıt</Link>
              </div>
            ) : (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '25px' }}>
                {user.role === 'admin' && <Link to="/admin" style={{...styles.link, color: '#ffc107'}}>Admin</Link>}
                <span style={{ fontSize: '14px', color: '#888' }}>{user.firstName}</span>
                <button onClick={() => { localStorage.removeItem('user'); window.location.href="/"; }} style={{...styles.btn, padding: '8px 15px', backgroundColor: '#333'}}>Çıkış</button>
              </div>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/new-post" element={user ? <NewPost user={user} /> : <Navigate to="/login" />} />
            <Route path="/edit-post/:id" element={user ? <EditPost user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}