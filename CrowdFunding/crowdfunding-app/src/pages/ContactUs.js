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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 mb-5 bg-white rounded" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 className="mb-4 text-center">Contact Us</h1>
        {notification && (
          <div className={`alert ${notification.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your message"
              rows="4"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;


