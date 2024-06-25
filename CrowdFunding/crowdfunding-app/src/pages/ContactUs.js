import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [notification, setNotification] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate email sending
    setTimeout(() => {
      setNotification('Your email has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 1000); // Simulate network delay
  };

  return (
    <div style={styles.contactUs}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.button}>Send</button>
      </form>
      {notification && <p>{notification}</p>}
    </div>
  );
};

const styles = {
  contactUs: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1em',
    background: '#f9f9f9',
    borderRadius: '5px',
  },
  formGroup: {
    marginBottom: '1em',
  },
  input: {
    width: '100%',
    padding: '0.5em',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '0.5em',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.7em 2em',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ContactUs;
