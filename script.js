// Données des produits
const produits = {
    habits: [
        { id: 1, nom: "T-shirt Premium", prix: 29.99, emoji: "👕", categorie: "habits" },
        { id: 2, nom: "Jeans Slim Fit", prix: 69.99, emoji: "👖", categorie: "habits" },
        { id: 3, nom: "Veste en Cuir", prix: 149.99, emoji: "🧥", categorie: "habits" },
        { id: 4, nom: "Robe Élégante", prix: 89.99, emoji: "👗", categorie: "habits" },
        { id: 5, nom: "Sweat Oversize", prix: 49.99, emoji: "👘", categorie: "habits" },
        { id: 6, nom: "Chemise Oxford", prix: 59.99, emoji: "👔", categorie: "habits" }
    ],
    telephones: [
        { id: 7, nom: "iPhone 15 Pro", prix: 999.99, emoji: "📱", categorie: "telephones" },
        { id: 8, nom: "Samsung S24 Ultra", prix: 899.99, emoji: "📱", categorie: "telephones" },
        { id: 9, nom: "Google Pixel 8", prix: 699.99, emoji: "📱", categorie: "telephones" },
        { id: 10, nom: "Xiaomi 14", prix: 599.99, emoji: "📱", categorie: "telephones" },
        { id: 11, nom: "OnePlus 12", prix: 749.99, emoji: "📱", categorie: "telephones" },
        { id: 12, nom: "iPhone 14", prix: 699.99, emoji: "📱", categorie: "telephones" }
    ]
};

// Panier
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    afficherProduits();
    afficherPanier();
    mettreAJourCompteurPanier();
});

// Afficher les produits
function afficherProduits() {
    const habitsGrid = document.getElementById('habits-grid');
    const telephonesGrid = document.getElementById('telephones-grid');
    
    produits.habits.forEach(produit => {
        habitsGrid.innerHTML += creerCarteProduit(produit);
    });
    
    produits.telephones.forEach(produit => {
        telephonesGrid.innerHTML += creerCarteProduit(produit);
    });
    
    // Ajouter les event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            ajouterAuPanier(id);
        });
    });
}

// Créer carte produit
function creerCarteProduit(produit) {
    return `
        <div class="product-card" onclick="voirDetails(${produit.id})">
            <div class="product-image">${produit.emoji}</div>
            <div class="product-info">
                <h3>${produit.nom}</h3>
                <div class="product-price">${produit.prix.toFixed(2)}€</div>
                <button class="add-to-cart" data-id="${produit.id}">
                    <i class="fas fa-cart-plus"></i> Ajouter
                </button>
            </div>
        </div>
    `;
}

// Ajouter au panier
function ajouterAuPanier(id) {
    const produit = [...produits.habits, ...produits.telephones].find(p => p.id === id);
    const existant = panier.find(item => item.id === id);
    
    if (existant) {
        existant.quantite += 1;
    } else {
        panier.push({ ...produit, quantite: 1 });
    }
    
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
    mettreAJourCompteurPanier();
    afficherNotification('Produit ajouté au panier !');
}

// Afficher panier
function afficherPanier() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (panier.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide</p>';
        cartTotal.textContent = '0€';
        return;
    }
    
    cartItems.innerHTML = panier.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.nom}</strong> 
                <span>x${item.quantite}</span>
            </div>
            <div>
                ${(item.prix * item.quantite).toFixed(2)}€
                <button onclick="retirerDuPanier(${item.id})" style="margin-left:10px;background:none;border:none;color:#ff4757;font-size:1.2rem;cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    cartTotal.textContent = total.toFixed(2) + '€';
}

// Compteur panier
function mettreAJourCompteurPanier() {
    const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Retirer du panier
function retirerDuPanier(id) {
    panier = panier.filter(item => item.id !== id);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
    mettreAJourCompteurPanier();
}

// Modal panier
document.querySelector('.cart-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('cartModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('cartModal').style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Checkout
function checkout() {
    if (panier.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    alert(`Merci pour votre commande de ${total.toFixed(2)}€ !\n\n🚀 Commande confirmée ! (Simulation)`);
    
    panier = [];
    localStorage.removeItem('panier');
    afficherPanier();
    mettreAJourCompteurPanier();
    document.getElementById('cartModal').style.display = 'none';
}

// Navigation fluide
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Notification
function afficherNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #00b894;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 
            }// 🔥 DONNÉES PRODUITS COMPLÈTES
const produits = {
    habits: [
        { id: 1, nom: "T-shirt Premium Cotton", prix: 29.99, emoji: "👕", image: "images/tshirt.jpg", stock: 50, promo: 0 },
        { id: 2, nom: "Jeans Slim Fit Denim", prix: 69.99, emoji: "👖", image: "images/jeans.jpg", stock: 30, promo: 10 },
        { id: 3, nom: "Veste en Cuir Véritable", prix: 149.99, emoji: "🧥", image: "images/veste.jpg", stock: 15, promo: 0 },
        { id: 4, nom: "Robe Élégante Soirée", prix: 89.99, emoji: "👗", image: "images/robe.jpg", stock: 25, promo: 15 },
        { id: 5, nom: "Sweat Oversize Confort", prix: 49.99, emoji: "👘", image: "images/sweat.jpg", stock: 40, promo: 0 },
        { id: 6, nom: "Chemise Oxford Classique", prix: 59.99, emoji: "👔", image: "images/chemise.jpg", stock: 35, promo: 5 }
    ],
    telephones: [
        { id: 7, nom: "iPhone 15 Pro Max 256Go", prix: 1199.99, emoji: "📱", image: "images/iphone15.jpg", stock: 
