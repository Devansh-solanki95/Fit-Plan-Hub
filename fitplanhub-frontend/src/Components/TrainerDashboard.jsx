import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', duration: '' });

  const token = localStorage.getItem("jwtToken"); // JWT token from login

  // --- Fetch plans on component mount ---
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/user/plans", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.status === true) setPlans(data.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData(plan);
    } else {
      setEditingPlan(null);
      setFormData({ title: '', description: '', price: '', duration: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.duration) {
      alert('Please fill all fields');
      return;
    }

    try {
      let res, data;

      if (editingPlan) {
       
        res = await fetch(`http://localhost:8080/trainer/update-plan/${editingPlan.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        data = await res.json();
        if (data.status === true) {
          setPlans(plans.map(p => p.id === editingPlan.id ? data.data : p));
        }
      } else {
        // Create new plan
        res = await fetch("http://localhost:8080/trainer/create-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        data = await res.json();
        if (data.status === true) {
          setPlans([...plans, data.data]);
        }
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving plan:", err);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      const res = await fetch(`http://localhost:8080/trainer/delete-plan/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === true) {
        setPlans(plans.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("Something went wrong!");
    }
  };

  // --- Styles ---
  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' },
    innerContainer: { maxWidth: '1024px', margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
    title: { fontSize: '30px', fontWeight: 'bold', color: '#111827' },
    createButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' },
    plansList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    planCard: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' },
    planContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
    planInfo: { flex: 1 },
    planTitle: { fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    planDescription: { color: '#6b7280', marginBottom: '12px' },
    planDetails: { display: 'flex', gap: '16px', fontSize: '14px', color: '#374151' },
    planPrice: { fontWeight: '600' },
    actionButtons: { display: 'flex', gap: '8px' },
    iconButton: { padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    editButton: { color: '#2563eb', backgroundColor: 'transparent' },
    deleteButton: { color: '#dc2626', backgroundColor: 'transparent' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 },
    modalContent: { backgroundColor: 'white', borderRadius: '8px', maxWidth: '448px', width: '100%', padding: '24px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    modalTitle: { fontSize: '24px', fontWeight: 'bold', color: '#111827' },
    closeButton: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' },
    formContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    gridRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    buttonGroup: { display: 'flex', gap: '12px', paddingTop: '16px' },
    cancelButton: { flex: 1, padding: '8px 16px', border: '1px solid #d1d5db', color: '#374151', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    submitButton: { flex: 1, padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Fitness Plans</h1>
          <button onClick={() => handleOpenModal()} style={styles.createButton}>
            <Plus style={{ width: '20px', height: '20px' }} /> Create Plan
          </button>
        </div>

        <div style={styles.plansList}>
          {plans.map(plan => (
            <div key={plan.id} style={styles.planCard}>
              <div style={styles.planContent}>
                <div style={styles.planInfo}>
                  <h3 style={styles.planTitle}>{plan.title}</h3>
                  <p style={styles.planDescription}>{plan.description}</p>
                  <div style={styles.planDetails}>
                    <span style={styles.planPrice}>Rs{plan.price}</span>
                    <span>•</span>
                    <span>{plan.duration} days</span>
                  </div>
                </div>
                <div style={styles.actionButtons}>
                  <button onClick={() => handleOpenModal(plan)} style={{ ...styles.iconButton, ...styles.editButton }}>
                    <Edit style={{ width: '20px', height: '20px' }} />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} style={{ ...styles.iconButton, ...styles.deleteButton }}>
                    <Trash2 style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
                <button onClick={handleCloseModal} style={styles.closeButton}>
                  <X style={{ width: '24px', height: '24px' }} />
                </button>
              </div>

              <div style={styles.formContainer}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={styles.input} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" style={styles.textarea} />
                </div>

                <div style={styles.gridRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price (Rs)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Duration (days)</label>
                    <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} style={styles.input} />
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button type="button" onClick={handleCloseModal} style={styles.cancelButton}>Cancel</button>
                  <button type="button" onClick={handleSubmit} style={styles.submitButton}>{editingPlan ? 'Update' : 'Create'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainerDashboard;
