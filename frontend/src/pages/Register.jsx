import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const subcountiesByCounty = {
  "Makueni": ["Makueni Subcounty 1", "Makueni Subcounty 2", "Makueni Subcounty 3"],
  "Mombasa": ["Mombasa Subcounty 1", "Mombasa Subcounty 2", "Mombasa Subcounty 3"],
  "Kisumu": ["Kisumu Subcounty 1", "Kisumu Subcounty 2", "Kisumu Subcounty 3"],
  "Nakuru": ["Nakuru Subcounty 1", "Nakuru Subcounty 2", "Nakuru Subcounty 3"],
  "Nairobi": ["Nairobi Subcounty 1", "Nairobi Subcounty 2", "Nairobi Subcounty 3"],
  "Kwale": ["Kwale Subcounty 1", "Kwale Subcounty 2", "Kwale Subcounty 3"],
  "Kilifi": ["Kilifi Subcounty 1", "Kilifi Subcounty 2", "Kilifi Subcounty 3"],
  "Lamu": ["Lamu Subcounty 1", "Lamu Subcounty 2", "Lamu Subcounty 3"],
  "Tana River": ["Tana River Subcounty 1", "Tana River Subcounty 2", "Tana River Subcounty 3"],
  "Garissa": ["Garissa Subcounty 1", "Garissa Subcounty 2", "Garissa Subcounty 3"],
  "Wajir": ["Wajir Subcounty 1", "Wajir Subcounty 2", "Wajir Subcounty 3"],
  "Mandera": ["Mandera Subcounty 1", "Mandera Subcounty 2", "Mandera Subcounty 3"],
  "Marsabit": ["Marsabit Subcounty 1", "Marsabit Subcounty 2", "Marsabit Subcounty 3"],
  "Isiolo": ["Isiolo Subcounty 1", "Isiolo Subcounty 2", "Isiolo Subcounty 3"],
  "Meru": ["Meru Subcounty 1", "Meru Subcounty 2", "Meru Subcounty 3"],
  "Tharaka-Nithi": ["Tharaka-Nithi Subcounty 1", "Tharaka-Nithi Subcounty 2", "Tharaka-Nithi Subcounty 3"],
  "Embu": ["Embu Subcounty 1", "Embu Subcounty 2", "Embu Subcounty 3"],
  "Kitui": ["Kitui Subcounty 1", "Kitui Subcounty 2", "Kitui Subcounty 3"],
  "Machakos": ["Machakos Subcounty 1", "Machakos Subcounty 2", "Machakos Subcounty 3"],
  "Kajiado": ["Kajiado Subcounty 1", "Kajiado Subcounty 2", "Kajiado Subcounty 3"],
  "Kericho": ["Kericho Subcounty 1", "Kericho Subcounty 2", "Kericho Subcounty 3"],
  "Bomet": ["Bomet Subcounty 1", "Bomet Subcounty 2", "Bomet Subcounty 3"],
  "Kakamega": ["Kakamega Subcounty 1", "Kakamega Subcounty 2", "Kakamega Subcounty 3"],
  "Vihiga": ["Vihiga Subcounty 1", "Vihiga Subcounty 2", "Vihiga Subcounty 3"],
  "Bungoma": ["Bungoma Subcounty 1", "Bungoma Subcounty 2", "Bungoma Subcounty 3"],
  "Busia": ["Busia Subcounty 1", "Busia Subcounty 2", "Busia Subcounty 3"],
  "Siaya": ["Siaya Subcounty 1", "Siaya Subcounty 2", "Siaya Subcounty 3"],
  "Kisii": ["Kisii Subcounty 1", "Kisii Subcounty 2", "Kisii Subcounty 3"],
  "Nyamira": ["Nyamira Subcounty 1", "Nyamira Subcounty 2", "Nyamira Subcounty 3"],
  "Homa Bay": ["Homa Bay Subcounty 1", "Homa Bay Subcounty 2", "Homa Bay Subcounty 3"],
  "Migori": ["Migori Subcounty 1", "Migori Subcounty 2", "Migori Subcounty 3"],
  "Nandi": ["Nandi Subcounty 1", "Nandi Subcounty 2", "Nandi Subcounty 3"],
  "Uasin Gishu": ["Uasin Gishu Subcounty 1", "Uasin Gishu Subcounty 2", "Uasin Gishu Subcounty 3"],
  "Elgeyo-Marakwet": ["Elgeyo-Marakwet Subcounty 1", "Elgeyo-Marakwet Subcounty 2", "Elgeyo-Marakwet Subcounty 3"],
  "Sotik": ["Sotik Subcounty 1", "Sotik Subcounty 2", "Sotik Subcounty 3"]
};

const wardsBySubcounty = {
  "Makueni Subcounty 1": ["Makueni Ward 1", "Makueni Ward 2"],
  "Makueni Subcounty 2": ["Makueni Ward 3", "Makueni Ward 4"],
  "Makueni Subcounty 3": ["Makueni Ward 5", "Makueni Ward 6"],
  "Mombasa Subcounty 1": ["Mombasa Ward 1", "Mombasa Ward 2"],
  "Mombasa Subcounty 2": ["Mombasa Ward 3", "Mombasa Ward 4"],
  "Mombasa Subcounty 3": ["Mombasa Ward 5", "Mombasa Ward 6"],
  "Kisumu Subcounty 1": ["Kisumu Ward 1", "Kisumu Ward 2"],
  "Kisumu Subcounty 2": ["Kisumu Ward 3", "Kisumu Ward 4"],
  "Kisumu Subcounty 3": ["Kisumu Ward 5", "Kisumu Ward 6"],
  "Nakuru Subcounty 1": ["Nakuru Ward 1", "Nakuru Ward 2"],
  "Nakuru Subcounty 2": ["Nakuru Ward 3", "Nakuru Ward 4"],
  "Nakuru Subcounty 3": ["Nakuru Ward 5", "Nakuru Ward 6"],
  "Nairobi Subcounty 1": ["Nairobi Ward 1", "Nairobi Ward 2"],
  "Nairobi Subcounty 2": ["Nairobi Ward 3", "Nairobi Ward 4"],
  "Nairobi Subcounty 3": ["Nairobi Ward 5", "Nairobi Ward 6"],
  "Kwale Subcounty 1": ["Kwale Ward 1", "Kwale Ward 2"],
  "Kwale Subcounty 2": ["Kwale Ward 3", "Kwale Ward 4"],
  "Kwale Subcounty 3": ["Kwale Ward 5", "Kwale Ward 6"],
  "Kilifi Subcounty 1": ["Kilifi Ward 1", "Kilifi Ward 2"],
  "Kilifi Subcounty 2": ["Kilifi Ward 3", "Kilifi Ward 4"],
  "Kilifi Subcounty 3": ["Kilifi Ward 5", "Kilifi Ward 6"],
  "Lamu Subcounty 1": ["Lamu Ward 1", "Lamu Ward 2"],
  "Lamu Subcounty 2": ["Lamu Ward 3", "Lamu Ward 4"],
  "Lamu Subcounty 3": ["Lamu Ward 5", "Lamu Ward 6"],
  "Tana River Subcounty 1": ["Tana River Ward 1", "Tana River Ward 2"],
  "Tana River Subcounty 2": ["Tana River Ward 3", "Tana River Ward 4"],
  "Tana River Subcounty 3": ["Tana River Ward 5", "Tana River Ward 6"],
  "Garissa Subcounty 1": ["Garissa Ward 1", "Garissa Ward 2"],
  "Garissa Subcounty 2": ["Garissa Ward 3", "Garissa Ward 4"],
  "Garissa Subcounty 3": ["Garissa Ward 5", "Garissa Ward 6"],
  "Wajir Subcounty 1": ["Wajir Ward 1", "Wajir Ward 2"],
  "Wajir Subcounty 2": ["Wajir Ward 3", "Wajir Ward 4"],
  "Wajir Subcounty 3": ["Wajir Ward 5", "Wajir Ward 6"],
  "Mandera Subcounty 1": ["Mandera Ward 1", "Mandera Ward 2"],
  "Mandera Subcounty 2": ["Mandera Ward 3", "Mandera Ward 4"],
  "Mandera Subcounty 3": ["Mandera Ward 5", "Mandera Ward 6"],
  "Marsabit Subcounty 1": ["Marsabit Ward 1", "Marsabit Ward 2"],
  "Marsabit Subcounty 2": ["Marsabit Ward 3", "Marsabit Ward 4"],
  "Marsabit Subcounty 3": ["Marsabit Ward 5", "Marsabit Ward 6"],
  "Isiolo Subcounty 1": ["Isiolo Ward 1", "Isiolo Ward 2"],
  "Isiolo Subcounty 2": ["Isiolo Ward 3", "Isiolo Ward 4"],
  "Isiolo Subcounty 3": ["Isiolo Ward 5", "Isiolo Ward 6"],
  "Meru Subcounty 1": ["Meru Ward 1", "Meru Ward 2"],
  "Meru Subcounty 2": ["Meru Ward 3", "Meru Ward 4"],
  "Meru Subcounty 3": ["Meru Ward 5", "Meru Ward 6"],
  "Tharaka-Nithi Subcounty 1": ["Tharaka-Nithi Ward 1", "Tharaka-Nithi Ward 2"],
  "Tharaka-Nithi Subcounty 2": ["Tharaka-Nithi Ward 3", "Tharaka-Nithi Ward 4"],
  "Tharaka-Nithi Subcounty 3": ["Tharaka-Nithi Ward 5", "Tharaka-Nithi Ward 6"],
  "Embu Subcounty 1": ["Embu Ward 1", "Embu Ward 2"],
  "Embu Subcounty 2": ["Embu Ward 3", "Embu Ward 4"],
  "Embu Subcounty 3": ["Embu Ward 5", "Embu Ward 6"],
  "Kitui Subcounty 1": ["Kitui Ward 1", "Kitui Ward 2"],
  "Kitui Subcounty 2": ["Kitui Ward 3", "Kitui Ward 4"],
  "Kitui Subcounty 3": ["Kitui Ward 5", "Kitui Ward 6"],
  "Machakos Subcounty 1": ["Machakos Ward 1", "Machakos Ward 2"],
  "Machakos Subcounty 2": ["Machakos Ward 3", "Machakos Ward 4"],
  "Machakos Subcounty 3": ["Machakos Ward 5", "Machakos Ward 6"],
  "Kajiado Subcounty 1": ["Kajiado Ward 1", "Kajiado Ward 2"],
  "Kajiado Subcounty 2": ["Kajiado Ward 3", "Kajiado Ward 4"],
  "Kajiado Subcounty 3": ["Kajiado Ward 5", "Kajiado Ward 6"],
  "Kericho Subcounty 1": ["Kericho Ward 1", "Kericho Ward 2"],
  "Kericho Subcounty 2": ["Kericho Ward 3", "Kericho Ward 4"],
  "Kericho Subcounty 3": ["Kericho Ward 5", "Kericho Ward 6"],
  "Bomet Subcounty 1": ["Bomet Ward 1", "Bomet Ward 2"],
  "Bomet Subcounty 2": ["Bomet Ward 3", "Bomet Ward 4"],
  "Bomet Subcounty 3": ["Bomet Ward 5", "Bomet Ward 6"],
  "Kakamega Subcounty 1": ["Kakamega Ward 1", "Kakamega Ward 2"],
  "Kakamega Subcounty 2": ["Kakamega Ward 3", "Kakamega Ward 4"],
  "Kakamega Subcounty 3": ["Kakamega Ward 5", "Kakamega Ward 6"],
  "Vihiga Subcounty 1": ["Vihiga Ward 1", "Vihiga Ward 2"],
  "Vihiga Subcounty 2": ["Vihiga Ward 3", "Vihiga Ward 4"],
  "Vihiga Subcounty 3": ["Vihiga Ward 5", "Vihiga Ward 6"],
  "Bungoma Subcounty 1": ["Bungoma Ward 1", "Bungoma Ward 2"],
  "Bungoma Subcounty 2": ["Bungoma Ward 3", "Bungoma Ward 4"],
  "Bungoma Subcounty 3": ["Bungoma Ward 5", "Bungoma Ward 6"],
  "Busia Subcounty 1": ["Busia Ward 1", "Busia Ward 2"],
  "Busia Subcounty 2": ["Busia Ward 3", "Busia Ward 4"],
  "Busia Subcounty 3": ["Busia Ward 5", "Busia Ward 6"],
  "Siaya Subcounty 1": ["Siaya Ward 1", "Siaya Ward 2"],
  "Siaya Subcounty 2": ["Siaya Ward 3", "Siaya Ward 4"],
  "Siaya Subcounty 3": ["Siaya Ward 5", "Siaya Ward 6"],
  "Kisii Subcounty 1": ["Kisii Ward 1", "Kisii Ward 2"],
  "Kisii Subcounty 2": ["Kisii Ward 3", "Kisii Ward 4"],
  "Kisii Subcounty 3": ["Kisii Ward 5", "Kisii Ward 6"],
  "Nyamira Subcounty 1": ["Nyamira Ward 1", "Nyamira Ward 2"],
  "Nyamira Subcounty 2": ["Nyamira Ward 3", "Nyamira Ward 4"],
  "Nyamira Subcounty 3": ["Nyamira Ward 5", "Nyamira Ward 6"],
  "Homa Bay Subcounty 1": ["Homa Bay Ward 1", "Homa Bay Ward 2"],
  "Homa Bay Subcounty 2": ["Homa Bay Ward 3", "Homa Bay Ward 4"],
  "Homa Bay Subcounty 3": ["Homa Bay Ward 5", "Homa Bay Ward 6"],
  "Migori Subcounty 1": ["Migori Ward 1", "Migori Ward 2"],
  "Migori Subcounty 2": ["Migori Ward 3", "Migori Ward 4"],
  "Migori Subcounty 3": ["Migori Ward 5", "Migori Ward 6"],
  "Nandi Subcounty 1": ["Nandi Ward 1", "Nandi Ward 2"],
  "Nandi Subcounty 2": ["Nandi Ward 3", "Nandi Ward 4"],
  "Nandi Subcounty 3": ["Nandi Ward 5", "Nandi Ward 6"],
  "Uasin Gishu Subcounty 1": ["Uasin Gishu Ward 1", "Uasin Gishu Ward 2"],
  "Uasin Gishu Subcounty 2": ["Uasin Gishu Ward 3", "Uasin Gishu Ward 4"],
  "Uasin Gishu Subcounty 3": ["Uasin Gishu Ward 5", "Uasin Gishu Ward 6"],
  "Elgeyo-Marakwet Subcounty 1": ["Elgeyo-Marakwet Ward 1", "Elgeyo-Marakwet Ward 2"],
  "Elgeyo-Marakwet Subcounty 2": ["Elgeyo-Marakwet Ward 3", "Elgeyo-Marakwet Ward 4"],
  "Elgeyo-Marakwet Subcounty 3": ["Elgeyo-Marakwet Ward 5", "Elgeyo-Marakwet Ward 6"],
  "Sotik Subcounty 1": ["Sotik Ward 1", "Sotik Ward 2"],
  "Sotik Subcounty 2": ["Sotik Ward 3", "Sotik Ward 4"],
  "Sotik Subcounty 3": ["Sotik Ward 5", "Sotik Ward 6"]
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [ward, setWard] = useState('');
  const [subcounty, setSubcounty] = useState('');
  const [county, setCounty] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const navigate = useNavigate();

  const handleCountyChange = (e) => {
    setCounty(e.target.value);
    setSubcounty(''); // Reset subcounty when county changes
    setWard(''); // Reset ward when county changes
  };

  const handleSubcountyChange = (e) => {
    setSubcounty(e.target.value);
    setWard(''); // Reset ward when subcounty changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { username, password, fullName, ward, subcounty, county, idNumber });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed!';
      alert(errorMessage);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>ID Number:</label>
            <input
              type="text"
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>County:</label>
            <select
              value={county}
              onChange={handleCountyChange}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select County</option>
              <option value="Makueni">Makueni</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Kwale">Kwale</option>
              <option value="Kilifi">Kilifi</option>
              <option value="Lamu">Lamu</option>
              <option value="Tana River">Tana River</option>
              <option value="Garissa">Garissa</option>
              <option value="Wajir">Wajir</option>
              <option value="Mandera">Mandera</option>
              <option value="Marsabit">Marsabit</option>
              <option value="Isiolo">Isiolo</option>
              <option value="Meru">Meru</option>
              <option value="Tharaka-Nithi">Tharaka-Nithi</option>
              <option value="Embu">Embu</option>
              <option value="Kitui">Kitui</option>
              <option value="Machakos">Machakos</option>
              <option value="Kajiado">Kajiado</option>
              <option value="Kericho">Kericho</option>
              <option value="Bomet">Bomet</option>
              <option value="Kakamega">Kakamega</option>
              <option value="Vihiga">Vihiga</option>
              <option value="Bungoma">Bungoma</option>
              <option value="Busia">Busia</option>
              <option value="Siaya">Siaya</option>
              <option value="Kisii">Kisii</option>
              <option value="Nyamira">Nyamira</option>
              <option value="Homa Bay">Homa Bay</option>
              <option value="Migori">Migori</option>
              <option value="Nandi">Nandi</option>
              <option value="Uasin Gishu">Uasin Gishu</option>
              <option value="Elgeyo-Marakwet">Elgeyo-Marakwet</option>
              <option value="Sotik">Sotik</option>

            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Subcounty:</label>
            <select
              value={subcounty}
              onChange={handleSubcountyChange}
              required
              disabled={!county}
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select Subcounty</option>
              {county && subcountiesByCounty[county]?.map((subcountyOption) => (
                <option key={subcountyOption} value={subcountyOption}>
                  {subcountyOption}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Ward:</label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              required
              disabled={!subcounty}
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select Ward</option>
              {subcounty && wardsBySubcounty[subcounty]?.map((wardOption) => (
                <option key={wardOption} value={wardOption}>
                  {wardOption}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
