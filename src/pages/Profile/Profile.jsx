import { useState } from 'react';
import { useProfile } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import styles from './Profile.module.css';

function Profile() {
  const { profile, updateProfile, items, itemsLoading, itemsError, addItem, deleteItem } = useProfile();
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

  return (
    <div className={styles.container}>
      <Badge>Welcome, {profile.nickname || profile.fullName || 'cool user'}</Badge>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            className={styles.input}
            placeholder="Full Name"
            value={profile.fullName || ''}
            onChange={handleChange}
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
          />
        </div>
      </div>

      <Badge>Your Marketplace Items</Badge>

      {itemsLoading && <p>Loading items...</p>}
      {itemsError && <p>Error loading items: {itemsError}</p>}

      <div className={styles.itemsList}>
        {items.map((item) => (
          <Card key={item.id} className={styles.itemRow}>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>{item.title}</span>
              {item.description && (
                <span className={styles.itemDescription}>{item.description}</span>
              )}
            </div>
            <div className={styles.itemRight}>
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
            </div>
          </Card>
        ))}
      </div>

      {showAddForm ? (
        <Card className={styles.itemForm}>
          <form onSubmit={handleSubmitItem} style={{ display: 'contents' }}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Item title"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className={styles.input}
                style={{ flex: 2 }}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className={styles.input}
                style={{ flex: 1 }}
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
    </div>
  );
}

export default Profile;