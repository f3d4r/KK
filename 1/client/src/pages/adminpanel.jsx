import React, { useState } from 'react';
import '../components/adminpanel/adminpanel.css';
import AllProductsList from '../components/adminpanel/AllProductsList';
import AddProductForm from '../components/adminpanel/AddProductForm';

function AdminPanel() {
  const [activeTab] = useState('Товары');
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  return (
    <div className="admin">
      <div className="container">
        
        {/* Отображаем контент в зависимости от активной вкладки */}
        {activeTab === 'Товары' && (
          <div>
            <button className='add_new_product_button' onClick={() => setShowAddProductForm(!showAddProductForm)}>
              {showAddProductForm ? 'Скрыть форму добавления товара' : 'Добавить новый товар'}
            </button> 
            {showAddProductForm && <AddProductForm onProductAdded/>} {/* КК удален handleProductAdded */}
            <AllProductsList />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;