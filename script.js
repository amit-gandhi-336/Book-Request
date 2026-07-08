let books = [];
let cart = [];

const booksContainer = document.getElementById("booksContainer");
const template = document.getElementById("bookTemplate");

const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const searchBox = document.getElementById("searchBox");


// ==========================
// Load books.json
// ==========================

fetch("books.json")
.then(res => res.json())
.then(data => {

    books = data;

    displayBooks(books);

})
.catch(err => {

    console.error(err);

    alert("books.json could not be loaded.");

});


// ==========================
// Display Books
// ==========================

function displayBooks(bookArray){

    booksContainer.innerHTML = "";

    bookArray.forEach(book=>{

        const clone = template.content.cloneNode(true);

        clone.querySelector(".book-image").src = book.image;
        clone.querySelector(".book-image").alt = book.title;

        clone.querySelector(".book-title").textContent =
            book.title || "";

        const details = clone.querySelector(".details");

details.innerHTML = "";

book.description.forEach(line => {

    const p = document.createElement("p");

    p.textContent = line;

    details.appendChild(p);

});

        const qtyInput =
            clone.querySelector("input");

        const minus =
            clone.querySelector(".minus");

        const plus =
            clone.querySelector(".plus");

        minus.onclick = ()=>{

            let v = parseInt(qtyInput.value)||0;

            if(v>0)
                qtyInput.value = v-1;

        };

        plus.onclick = ()=>{

            let v = parseInt(qtyInput.value)||0;

            qtyInput.value = v+1;

        };

        clone.querySelector(".cart-btn").onclick = ()=>{

            addToCart(book, qtyInput);

        };

        clone.querySelector(".book-image").onclick = ()=>{

            previewImage(book.image);

        };

        booksContainer.appendChild(clone);

    });

}



// ==========================
// Search
// ==========================

searchBox.addEventListener("input", ()=>{

    const value =
        searchBox.value
        .trim()
        .toLowerCase();

    const filtered =
        books.filter(book=>{

            return (
                (book.title || "")
                .toLowerCase()
                .includes(value)
            );

        });

    displayBooks(filtered);

});



// ==========================
// Cart
// ==========================

function addToCart(book,input){

    let qty =
        parseInt(input.value);

    if(!qty || qty<=0){

        alert("कृपया मात्रा चुनें");

        return;
    }

    const existing =
        cart.find(i=>i.id===book.id);

    if(existing){

        existing.qty += qty;

    }
    else{

        cart.push({

            id:book.id,

            title:book.title,

            qty:qty

        });

    }

    input.value = 0;

    updateCart();

}



// ==========================
// Update Cart
// ==========================

function updateCart(){

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item,index)=>{

        total += item.qty;

        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

        <div>

            <strong>${item.title}</strong>

            <br>

            मात्रा : ${item.qty}

        </div>

        <button
            class="removeBtn"
            onclick="removeItem(${index})">

            ❌

        </button>

        `;

        cartItems.appendChild(div);

    });

    cartCount.textContent = total;

}



// ==========================
// Remove Cart Item
// ==========================

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}



// ==========================
// Toggle Cart
// ==========================

function toggleCart(){

    if(cartPanel.style.display==="block"){

        cartPanel.style.display="none";

    }
    else{

        cartPanel.style.display="block";

    }

}



// ==========================
// Image Preview
// ==========================

function previewImage(src){

    const div =
        document.createElement("div");

    div.className = "preview";

    div.innerHTML =

    `<img src="${src}">`;

    div.onclick = ()=>{

        div.remove();

    };

    document.body.appendChild(div);

}
// ==========================
// Customer Form
// ==========================

function openCustomerForm(){

    if(cart.length===0){

        alert("कृपया पहले पुस्तकें चुनें।");

        return;
    }

    document
        .getElementById("customerModal")
        .style.display = "flex";

}

function closeCustomerForm(){

    document
        .getElementById("customerModal")
        .style.display = "none";

}



// ==========================
// WhatsApp Order
// ==========================

function confirmOrder(){

    const name =
        document
        .getElementById("custName")
        .value
        .trim();

    const address =
        document
        .getElementById("custAddress")
        .value
        .trim();

    if(name===""){

        alert("कृपया अपना नाम दर्ज करें।");

        return;
    }

    if(address===""){

        alert("कृपया अपना पता दर्ज करें।");

        return;
    }

    let message =
`📚 पुस्तक ऑर्डर अनुरोध

👤 नाम : ${name}

🏠 पता :
${address}

📖 पुस्तकों की सूची :

`;

    cart.forEach((book,index)=>{

        message +=
`${index+1}. ${book.title}
   मात्रा : ${book.qty}

`;

    });

    message +=
`-------------------------
कुल पुस्तकें : ${cart.reduce((s,b)=>s+b.qty,0)}
`;

    // Replace with your WhatsApp number
    const phone = "917977517793";

    const url =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url,"_blank");

    // Clear cart

    cart = [];

    updateCart();

    closeCustomerForm();

    cartPanel.style.display = "none";

    document.getElementById("custName").value = "";
    document.getElementById("custAddress").value = "";

}



// ==========================
// Close Modal
// ==========================

window.onclick = function(event){

    const modal =
        document.getElementById("customerModal");

    if(event.target===modal){

        closeCustomerForm();

    }

};



// ==========================
// Quantity Validation
// ==========================

document.addEventListener("input",function(e){

    if(e.target.type==="number"){

        let value =
            parseInt(e.target.value);

        if(isNaN(value) || value<0){

            e.target.value = 0;

        }

    }

});



// ==========================
// ESC closes preview
// ==========================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        const preview =
            document.querySelector(".preview");

        if(preview){

            preview.remove();

        }

    }

});



// ==========================
// Close cart if empty
// ==========================

function checkEmptyCart(){

    if(cart.length===0){

        cartPanel.style.display = "none";

    }

}

const oldUpdateCart = updateCart;

updateCart = function(){

    oldUpdateCart();

    checkEmptyCart();

};



// ==========================
// Console Message
// ==========================

console.log("Siddhpath Book Store Loaded Successfully");