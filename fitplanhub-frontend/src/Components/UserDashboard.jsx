import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('all-plans');
  const [allPlans, setAllPlans] = useState([]);
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [followedTrainers, setFollowedTrainers] = useState([]);

  const token = localStorage.getItem('jwtToken');

  // Fetch all plans from backend
  useEffect(() => {
    fetch('http://localhost:8080/user/plans', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // data may not have id or duration, ensure default values
        const plans = data.map((p, index) => ({
          id: p.id || index + 1,
          title: p.title,
          trainerName: p.trainer,
          price: p.price,
          duration: p.duration || 30
        }));
        setAllPlans(plans);
      })
      .catch(err => console.error(err));
  }, [token]);

  // Fetch trainers dynamically (if you have an API, else keep static)
  useEffect(() => {
    fetch('http://localhost:8080/user/trainers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTrainers(data); // assume data has id, name, specialization
      })
      .catch(() => {
        // fallback to empty array
        setTrainers([]);
      });
  }, [token]);

  const handleSubscribe = async (planId) => {
    if (subscribedPlans.includes(planId)) return;

    try {
      const res = await fetch(`http://localhost:8080/user/subscribe/${planId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert('Plan subscribed successfully');
      setSubscribedPlans([...subscribedPlans, planId]);
    } catch (err) {
      alert('Subscription failed');
    }
  };

  const handleFollow = (trainerId) => {
    if (followedTrainers.includes(trainerId)) {
      setFollowedTrainers(followedTrainers.filter(id => id !== trainerId));
    } else {
      setFollowedTrainers([...followedTrainers, trainerId]);
    }
  };

  const myPlans = allPlans.filter(plan => subscribedPlans.includes(plan.id));

  // CSS
  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' },
    innerContainer: { maxWidth: '1024px', margin: '0 auto' },
    title: { fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' },
    card: { backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' },
    tabContainer: { display: 'flex', borderBottom: '1px solid #e5e7eb' },
    tab: { flex: 1, padding: '16px 24px', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' },
    tabActive: { color: '#2563eb', borderBottom: '2px solid #2563eb' },
    tabInactive: { color: '#6b7280' },
    content: { padding: '24px' },
    planList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    planCard: { padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', transition: 'box-shadow 0.2s' },
    planCardSubscribed: { backgroundColor: '#eff6ff' },
    planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
    planInfo: { flex: 1 },
    planTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' },
    planTrainer: { fontSize: '14px', color: '#6b7280', marginBottom: '12px' },
    planDetails: { display: 'flex', gap: '16px', fontSize: '14px', color: '#374151' },
    planPrice: { fontWeight: '600', fontSize: '18px', color: '#2563eb' },
    button: { padding: '8px 20px', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
    buttonPrimary: { backgroundColor: '#2563eb', color: 'white' },
    buttonDisabled: { backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' },
    emptyState: { textAlign: 'center', padding: '48px 0', color: '#6b7280' },
    trainerCard: { padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', transition: 'box-shadow 0.2s' },
    trainerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    trainerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    trainerAvatar: { width: '56px', height: '56px', background: 'linear-gradient(to bottom right, #2563eb, #9333ea)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' },
    trainerName: { fontSize: '18px', fontWeight: 'bold', color: '#111827' },
    trainerSpec: { fontSize: '14px', color: '#6b7280' },
    followButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
    followButtonActive: { backgroundColor: '#fef2f2', color: '#dc2626' },
    followButtonInactive: { backgroundColor: '#2563eb', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <h1 style={styles.title}>Fitness Hub</h1>

        <div style={styles.card}>
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('all-plans')}
              style={{ ...styles.tab, ...(activeTab === 'all-plans' ? styles.tabActive : styles.tabInactive) }}
            >
              All Plans
            </button>
            <button
              onClick={() => setActiveTab('my-plans')}
              style={{ ...styles.tab, ...(activeTab === 'my-plans' ? styles.tabActive : styles.tabInactive) }}
            >
              My Plans
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              style={{ ...styles.tab, ...(activeTab === 'trainers' ? styles.tabActive : styles.tabInactive) }}
            >
              Trainers
            </button>
          </div>

          <div style={styles.content}>
            {activeTab === 'all-plans' && (
              <div style={styles.planList}>
                {allPlans.map(plan => (
                  <div key={plan.id} style={styles.planCard}>
                    <div style={styles.planHeader}>
                      <div style={styles.planInfo}>
                        <h3 style={styles.planTitle}>{plan.title}</h3>
                        <p style={styles.planTrainer}>by {plan.trainerName}</p>
                        <div style={styles.planDetails}>
                          <span style={styles.planPrice}>${plan.price}</span>
                          <span>•</span>
                          <span>{plan.duration} days</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribedPlans.includes(plan.id)}
                        style={{
                          ...styles.button,
                          ...(subscribedPlans.includes(plan.id) ? styles.buttonDisabled : styles.buttonPrimary)
                        }}
                      >
                        {subscribedPlans.includes(plan.id) ? 'Subscribed' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'my-plans' && (
              <div style={styles.planList}>
                {myPlans.length === 0 ? (
                  <div style={styles.emptyState}>
                    <p>No subscribed plans yet</p>
                    <button
                      onClick={() => setActiveTab('all-plans')}
                      style={{ ...styles.button, ...styles.buttonPrimary }}
                    >
                      Browse Plans
                    </button>
                  </div>
                ) : (
                  myPlans.map(plan => (
                    <div key={plan.id} style={{ ...styles.planCard, ...styles.planCardSubscribed }}>
                      <div style={styles.planHeader}>
                        <div style={styles.planInfo}>
                          <h3 style={styles.planTitle}>{plan.title}</h3>
                          <p style={styles.planTrainer}>by {plan.trainerName}</p>
                          <div style={styles.planDetails}>
                            <span style={styles.planPrice}>${plan.price}</span>
                            <span>•</span>
                            <span>{plan.duration} days</span>
                          </div>
                        </div>
                        <button style={{ ...styles.button, ...styles.buttonPrimary }}>View Plan</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'trainers' && (
              <div style={styles.planList}>
                {trainers.map(trainer => (
                  <div key={trainer.id} style={styles.trainerCard}>
                    <div style={styles.trainerContent}>
                      <div style={styles.trainerLeft}>
                        <div style={styles.trainerAvatar}>
                          {trainer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 style={styles.trainerName}>{trainer.name}</h3>
                          <p style={styles.trainerSpec}>{trainer.specialization}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(trainer.id)}
                        style={{
                          ...styles.followButton,
                          ...(followedTrainers.includes(trainer.id) ? styles.followButtonActive : styles.followButtonInactive)
                        }}
                      >
                        <Heart
                          style={{
                            width: '16px',
                            height: '16px',
                            fill: followedTrainers.includes(trainer.id) ? 'currentColor' : 'none',
                            stroke: 'currentColor'
                          }}
                        />
                        {followedTrainers.includes(trainer.id) ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
