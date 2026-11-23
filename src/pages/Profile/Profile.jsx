import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProfile, useMarketplace, useProofs } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import styles from './Profile.module.css';

function Profile() {
  const { id } = useParams();
  const {
    profile,
    isOtherUser,
    chartData,
    loading,
    updateProfile,
    items,
    itemsLoading,
    itemsError,
    addItem,
    deleteItem,
  } = useProfile(id);

  const { items: marketplaceItems, buyItem } = useMarketplace();

  const { requestProof, proofs } = useProofs();
  const [requestedSuccess, setRequestedSuccess] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateProfile(name, value);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setItemTitle(item.title);
    setItemPrice(item.price);
    setItemDescription(item.description || '');
    setShowAddForm(true);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setItemTitle('');
    setItemPrice('');
    setItemDescription('');
    setShowAddForm(false);
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    if (itemTitle) {
      addItem(itemTitle, itemPrice, itemDescription, editingId);
      handleResetForm();
    }
  };

  const handleRequestProofClick = () => {
    if (profile.id) {
      requestProof(profile.id, 'Daily Habits');
      setRequestedSuccess(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading profile...</p>
      </div>
    );
  }

  const approvedProof = isOtherUser
    ? proofs.find((p) => p.toUserId === profile.id && p.status === 'approved')
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <Badge>
          {isOtherUser
            ? `Profile of ${profile.nickname || profile.name || 'User'}`
            : `Welcome, ${profile.nickname || profile.fullName || 'cool user'}`}
        </Badge>

        {isOtherUser && (
          <button
            type="button"
            className={styles.requestProofBtn}
            onClick={handleRequestProofClick}
            disabled={requestedSuccess}
          >
            {requestedSuccess ? 'Proof Requested ⏳' : '🔍 Request Proof of Discipline'}
          </button>
        )}
      </div>

      {isOtherUser && approvedProof && (
        <Card className={styles.proofVerifiedBanner}>
          <span>
            ✅ <strong>Verified Proof from {profile.name}:</strong> "{approvedProof.proofText}"
          </span>
          <span className={styles.proofDate}>Date: {approvedProof.date}</span>
        </Card>
      )}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            className={styles.input}
            placeholder="Full Name"
            value={profile.fullName || profile.name || ''}
            onChange={handleChange}
            disabled={isOtherUser}
          />
        </div>

        <div className={styles.field}>
          <label>Nickname</label>
          <input
            type="text"
            name="nickname"
            className={styles.input}
            placeholder="Nickname"
            value={profile.nickname || ''}
            onChange={handleChange}
            disabled={isOtherUser}
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="Email"
            value={profile.email || ''}
            onChange={handleChange}
            disabled={isOtherUser}
          />
        </div>

        <div className={styles.field}>
          <label>Country</label>
          <input
            type="text"
            name="country"
            className={styles.input}
            placeholder="Country"
            value={profile.country || ''}
            onChange={handleChange}
            disabled={isOtherUser}
          />
        </div>
      </div>

      {isOtherUser && chartData.length > 0 && (
        <>
          <Badge>{profile.nickname || profile.name || 'User'}'s Discipline (Last 28 Days)</Badge>
          <Card className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <span>Completed habits per day</span>
              <span>Discipline consistency</span>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userHabitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D31A42" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D31A42" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedDate" stroke="#191A23" fontSize={12} tickLine={false} />
                  <YAxis stroke="#191A23" fontSize={12} allowDecimals={false} domain={[0, 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #191A23',
                      borderRadius: '8px',
                    }}
                    formatter={(val) => [`${val} habits completed`, 'Discipline']}
                    labelFormatter={(lbl) => `Date: ${lbl}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="completedCount"
                    stroke="#D31A42"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#userHabitColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      <Badge>
        {isOtherUser ? `${profile.name || 'User'}'s Marketplace Items` : 'Your Marketplace Items'}
      </Badge>

      {itemsLoading && <p>Loading items...</p>}
      {itemsError && <p>Error loading items: {itemsError}</p>}

      <div className={styles.itemsList}>
        {items.map((item) => {
          const isUnlocked = isOtherUser
            ? Boolean(marketplaceItems.find((m) => m.id === item.id)?.unlocked)
            : true;

          return (
            <Card
              key={item.id}
              className={`${styles.itemRow} ${isOtherUser && !isUnlocked ? styles.purchasableItem : ''}`}
              onClick={() => {
                if (isOtherUser && !isUnlocked) {
                  buyItem(item.id);
                }
              }}
            >
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.title}</span>
                {(isUnlocked || !isOtherUser) && item.description && (
                  <span className={styles.itemDescription}>{item.description}</span>
                )}
              </div>

              <div className={styles.itemRight}>
                {isOtherUser ? (
                  isUnlocked ? (
                    <span>🔓 Unlocked</span>
                  ) : (
                    <span>🔒 {item.price} (Click to Buy)</span>
                  )
                ) : (
                  <>
                    <span>🔒 {item.price}</span>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={() => handleStartEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.deleteBtn}`}
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {!isOtherUser && (
        <>
          {showAddForm ? (
            <Card className={styles.itemForm}>
              <form onSubmit={handleSubmitItem} className={styles.itemFormContents}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Item title"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className={`${styles.input} ${styles.titleInput}`}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className={`${styles.input} ${styles.priceInput}`}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className={styles.input}
                />
                <div className={styles.formActions}>
                  <button type="submit" className={`${styles.btn} ${styles.saveBtn}`}>
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className={styles.btn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className={styles.addItemCard} onClick={() => setShowAddForm(true)}>
              <span>+ Add new item</span>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
