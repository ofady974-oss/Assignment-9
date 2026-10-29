var contactNameInput = document.getElementById('fullName');
var contactNumberInput = document.getElementById('phoneNumber');
var contactEmailInput = document.getElementById('emailAddress');
var contactAddressInput = document.getElementById('Address');
var contactGroupInput = document.getElementById('Group');
var contactNotesInput = document.getElementById('Notes');
var contactFavorite = document.getElementById('favorite-check');
var contactEmergency = document.getElementById('Emergency-check');
var contactSearch = document.getElementById('searchInput');
var addContactBtn = document.getElementById('addContact');
var updateContactBtn = document.getElementById('updateContact');
var modalElement = document.getElementById('staticBackdrop');
var updateIndex = 0
var contactList = []
var favoriteList = []
var emergencyList = []
var groupBackground = {
    Family: "success",
    Friends: "primary",
    Work: "info",
    School: "warning",
    Other: "dark"
}

storages()
// ==================================================================

function addContact() {
    var modal = bootstrap.Modal.getInstance(modalElement);

    var contact = {
        name: contactNameInput.value,
        number: contactNumberInput.value,
        email: contactEmailInput.value,
        address: contactAddressInput.value,
        group: contactGroupInput.value,
        notes: contactNotesInput.value,
        favorite: contactFavorite.checked,
        emergency: contactEmergency.checked
    }


    if (!nameValidation() || !numberValidation() || !emailValidation()) {
        if (contact.name == '') {
            Swal.fire({
                icon: "error",
                title: "Missing Name",
                text: "Please enter a name for the contact!",
            });
        }
        else if (!nameValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Name",
                text: "Name should contain only letters and spaces (2-50 characters)",
            });
        }
        else if (contact.number == '') {
            Swal.fire({
                icon: "error",
                title: "Missing Phone",
                text: "Please enter a phone number!",
            });
        }
        else if (!numberValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Phone",
                text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
            });
        }
        else if (!emailValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address",
            });
        }
        return
    }

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].number == contactNumberInput.value || contactNumberInput.value == '+2' + contactList[i].number) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Phone Number",
                text: `A contact with this phone number already exists: ${contactList[i].name}`,
            });
            return
        }
    }

    if (contact.favorite) {
        favoriteList.push(contact);
        localStorage.setItem('favoriteContacts', JSON.stringify(favoriteList))
        displayFavorite()
    }
    if (contact.emergency) {
        emergencyList.push(contact);
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyList))
        displayEmergency()
    }
    contactList.push(contact)
    localStorage.setItem('contacts', JSON.stringify(contactList))

    clearForm()

    Swal.fire({
        title: "Added!",
        text: "Contact has been added successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
    });

    displayContact()
    document.getElementById('total-contacts').innerHTML = contactList.length
    document.getElementById('manage-contact').innerHTML = `Manage and organize your ${contactList.length} contacts`
    modal.hide();
}

function clearForm() {
    contactNameInput.value = ''
    contactNumberInput.value = ''
    contactEmailInput.value = ''
    contactAddressInput.value = ''
    contactGroupInput.value = 'select-group'
    contactNotesInput.value = ''
    contactFavorite.checked = false
    contactEmergency.checked = false
}

function clearAlerts() {
    document.getElementById('name-input').classList.remove('mb-4');
    document.getElementById('nameValidate').classList.add('d-none');
    document.getElementById('number-input').classList.remove('mb-4');
    document.getElementById('numberValidate').classList.add('d-none');
    document.getElementById('email-input').classList.remove('mb-4');
    document.getElementById('emailValidate').classList.add('d-none')
}

function displayContact() {
    if (contactList.length !== 0) {
        var box = ''

        for (var i = 0; i < contactList.length; i++) {
            box += `<div class="contact-card col-12 col-md-6 p-2">
                            <div class="inner p-3 shadow rounded-4 border border-1 border-secondary border-opacity-10">
                                <div>
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="position-relative">
                                            <div
                                                class="bg-transparent rounded-circle position-absolute p-0 border border-3 border-white favorite-bg d-${contactList[i].favorite ? 'inline-block' : 'none'}">
                                                <div
                                                    class="bg-warning text-white rounded-circle p-1 d-flex align-items-center justify-content-center favorite-icon">
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                                <div
                                                class="bg-transparent rounded-circle position-absolute p-0 border border-3 border-white emergency-bg d-${contactList[i].emergency ? 'inline-block' : 'none'}">
                                                <div
                                                    class="bg-danger text-white rounded-circle p-1 d-flex align-items-center justify-content-center favorite-icon">
                                                    <i class="fa-solid fa-heart-pulse"></i>
                                                </div>
                                            </div>
                                            <div class="contact-background bg-primary rounded-4 col-12 fs-4 d-flex align-items-center justify-content-center text-white">${displayChar(contactList[i])}</div>
                                        </div>
                                        <div>
                                            <h3 class="fs-5">${contactList[i].name}</h3>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="bg-primary bg-opacity-10 py-1 px-2 fit-content rounded-3">
                                                    <i class="fa-solid fa-phone text-primary small"></i>
                                                </div>
                                                <span class="text-secondary fw-medium">${contactList[i].number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-2 d-${contactList[i].email == '' ? `none` : `flex`} align-items-center gap-2">
                                        <div class="bg-main p-1 px-2 rounded-2 fit-content">
                                            <i class="fa-solid fa-envelope text-purple small"></i>
                                        </div>
                                        <span class="text-secondary">${contactList[i].email}</span>
                                    </div>
                                    <div class="pt-2 d-${contactList[i].address == '' ? `none` : `flex`} align-items-center gap-2">
                                        <div class="bg-success bg-opacity-10 p-1 px-2 rounded-2 fit-content">
                                            <i class="fa-solid fa-location-dot text-success small"></i>
                                        </div>
                                        <span class="text-secondary">${contactList[i].address}</span>
                                    </div>
                                    <div class="py-3">
                                        <div class="bg-${groupBackground[contactList[i].group]} bg-opacity-10 p-1 px-2 rounded-2 fit-content d-${contactList[i].group == `select-group` ? `none` : `inline-block`}">
                                            <span class="small text-${groupBackground[contactList[i].group]} fw-medium small">${contactList[i].group}</span>
                                        </div>
                                        <div class="small bg-danger bg-opacity-10 p-1 px-2 rounded-2 fit-content d-${contactList[i].emergency ? `inline-block` : `none`}">
                                            <span class="small text-danger fw-semibold"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="border-top border-1 border-secondary border-opacity-10 pt-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex gap-3">
                                            <a href="tel:${contactList[i].number}" class="text-decoration-none">
                                                <div class="bg-success bg-opacity-10 py-1 px-2 rounded-2 fit-content">
                                                    <i class="fa-solid fa-phone text-success small"></i>
                                                </div>
                                            </a>
                                            <a href="mailto:${contactList[i].email}" class="text-decoration-none d-${contactList[i].email == '' ? 'none' : 'inline-block'}">
                                                <div class="bg-main bg-opacity-10 py-1 px-2 rounded-2 fit-content">
                                                    <i class="fa-solid fa-envelope text-purple small"></i>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="footer-buttons d-flex gap-0 align-items-center">
                                            <button onclick="addFavorite(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-${contactList[i].favorite ? 'solid text-warning' : 'regular text-secondary'} fa-star"></i></button>
                                            <button onclick="addEmergency(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-${contactList[i].emergency ? 'solid fa-heart-pulse text-danger' : `regular fa-heart text-secondary`} "></i></button>
                                            <button onclick="editContact(${i})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="border-0 bg-transparent"><i
                                                    class="fa-solid fa-pen text-secondary"></i></button>
                                            <button onclick="deleteContact(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-solid fa-trash text-secondary"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
        }
    }
    else {
        box = `<div class="d-flex flex-column align-items-center my-5">
        <i class="fa-solid fa-address-book text-secondary fs-1 pb-3"></i>
        <span class="fw-medium fs-5">No contacts found</span>
        <span class="text secondary">Click "Add Contact" to get started</span>
        </div>`
    }

    document.getElementById('contacts').innerHTML = box
    document.getElementById('total-contacts').innerHTML = contactList.length
    document.getElementById('manage-contact').innerHTML = `Manage and organize your ${contactList.length} contacts`
}

function displayChar(contact) {
    var char = contact.name[0]

    if (contact.name.includes(' ')) {
        char = contact.name.split(' ');
        return char[0][0] + char[1][0]
    }

    return char
}

function deleteContact(contactIndex) {
    Swal.fire({
        title: "Delete Contact?",
        text: `Are you sure you want to delete ${contactList[contactIndex].name} ? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            if (contactList[contactIndex].favorite) {
                contactList[contactIndex].favorite = !contactList[contactIndex].favorite
                localStorage.setItem('contacts', JSON.stringify(contactList))
                favoriteItems()
            }
            if (contactList[contactIndex].emergency) {
                contactList[contactIndex].emergency = !contactList[contactIndex].emergency
                localStorage.setItem('contacts', JSON.stringify(contactList))
                emergencyItems()
            }
            contactList.splice(contactIndex, 1)
            localStorage.setItem('contacts', JSON.stringify(contactList))

            displayContact()

            Swal.fire({
                title: "Deleted!",
                text: "Your contact has been deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
    document.getElementById('total-contacts').innerHTML = contactList.length
    document.getElementById('manage-contact').innerHTML = `Manage and organize your ${contactList.length} contacts`
}

function nameValidation() {
    var name = /^[A-Za-z\u0600-\u06FF\s]{2,50}$/;

    if (name.test(contactNameInput.value)) {
        document.getElementById('nameValidate').classList.add('d-none');
        document.getElementById('name-input').classList.remove('mb-4');
        return true
    }
    else {
        document.getElementById('nameValidate').classList.remove('d-none');
        document.getElementById('name-input').classList.add('mb-4');
        return false
    }
}

function numberValidation() {
    var number = /^(010|011|012|015)[0-9]{8}$|^\+20(10|11|12|15)[0-9]{8}$/;

    if (number.test(contactNumberInput.value)) {
        document.getElementById('numberValidate').classList.add('d-none');
        document.getElementById('number-input').classList.remove('mb-4');
        return true
    }
    else {
        document.getElementById('numberValidate').classList.remove('d-none');
        document.getElementById('number-input').classList.add('mb-4');
        return false
    }
}

function emailValidation() {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (contactEmailInput.value == '') {
        return true
    }
    else if (emailPattern.test(contactEmailInput.value)) {
        document.getElementById('emailValidate').classList.add('d-none')
        document.getElementById('email-input').classList.remove('mb-4');
        return true
    }
    else {
        document.getElementById('emailValidate').classList.remove('d-none')
        document.getElementById('email-input').classList.add('mb-4');
        return false
    }
}

function addFavorite(index) {
    contactList[index].favorite = !contactList[index].favorite
    localStorage.setItem('contacts', JSON.stringify(contactList))
    favoriteItems()
    displayContact()
}

function favoriteItems() {
    favoriteList = []

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].favorite) {
            favoriteList.push(contactList[i])
        }
    }
    localStorage.setItem('favoriteContacts', JSON.stringify(favoriteList))

    displayFavorite()
}

function displayFavorite() {
    if (favoriteList.length == 0) {
        box = `<div class='d-flex align-items-center justify-content-center text-secondary py-4'>No favorites yet</div>`
    }
    else {
        var box = ''

        for (var i = 0; i < favoriteList.length; i++) {
            box += `<div class="p-2 col-6 col-xl-12">
                                    <div class="contact p-2 d-flex align-items-center justify-content-between gap-2 rounded-3">
                                            <div class="fav-width bg-primary rounded-3 fs-4 d-flex align-items-center justify-content-center text-white">${displayChar(favoriteList[i])}</div>
                                        <div class="contact-info me-auto">
                                            <h6 class="small fw-medium m-0">${favoriteList[i].name}</h6>
                                            <p class="text-secondary m-0">${favoriteList[i].number}</p>
                                        </div>
                                        <a href="tel:${favoriteList[i].number}" class="text-decoration-none">
                                            <div
                                                class="call-bg bg-success bg-opacity-25 rounded-2 d-flex align-items-center justify-content-center">
                                                <i class="fa-solid fa-phone text-success small"></i>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                `
        }
    }
    document.getElementById('favorite').innerHTML = box
    document.getElementById('favorite-contacts').innerHTML = favoriteList.length
}

function addEmergency(emergencyIndex) {
    contactList[emergencyIndex].emergency = !contactList[emergencyIndex].emergency
    localStorage.setItem('contacts', JSON.stringify(contactList))

    emergencyItems()
    displayContact()
}

function emergencyItems() {
    emergencyList = []

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].emergency) {
            emergencyList.push(contactList[i])
        }
    }
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyList))

    displayEmergency()
}

function displayEmergency() {
    if (emergencyList.length == 0) {
        box = `<div class='d-flex align-items-center justify-content-center text-secondary py-4'>No emergency contacts</div>`
    }
    else {
        var box = ''

        for (var i = 0; i < emergencyList.length; i++) {
            box += `<div class="p-2 col-6 col-xl-12">
                                    <div
                                        class="contact p-2 d-flex align-items-center justify-content-between gap-2 rounded-3">
                                            <div class="fav-width bg-primary rounded-3 fs-4 d-flex align-items-center justify-content-center text-white">${displayChar(emergencyList[i])}</div>
                                        <div class="contact-info me-auto">
                                            <h6 class="small fw-medium m-0">${emergencyList[i].name}</h6>
                                            <p class="text-secondary m-0">${emergencyList[i].number}</p>
                                        </div>
                                        <a href="tel:${emergencyList[i].number}" class="text-decoration-none">
                                            <div
                                                class="call-bg bg-danger bg-opacity-25 rounded-2 d-flex align-items-center justify-content-center">
                                                <i class="fa-solid fa-phone text-danger small"></i>
                                            </div>
                                        </a>
                                    </div>
                                </div>`
        }
    }
    document.getElementById('emergency').innerHTML = box
    document.getElementById('emergency-contacts').innerHTML = emergencyList.length
}

function searchContact() {
    var term = ''

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].name.toUpperCase().includes(contactSearch.value.toUpperCase()) || contactList[i].number.includes(contactSearch.value) || contactList[i].email.toUpperCase().includes(contactSearch.value.toUpperCase()) || contactList[i].address.toUpperCase().includes(contactSearch.value.toUpperCase())) {
            term += `<div class="contact-card col-12 col-md-6 p-2">
                            <div class="inner p-3 shadow rounded-4 border border-1 border-secondary border-opacity-10">
                                <div>
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="position-relative">
                                            <div
                                                class="bg-transparent rounded-circle position-absolute p-0 border border-3 border-white favorite-bg d-${contactList[i].favorite ? 'inline-block' : 'none'}">
                                                <div
                                                    class="bg-warning text-white rounded-circle p-1 d-flex align-items-center justify-content-center favorite-icon">
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                                <div
                                                class="bg-transparent rounded-circle position-absolute p-0 border border-3 border-white emergency-bg d-${contactList[i].emergency ? 'inline-block' : 'none'}">
                                                <div
                                                    class="bg-danger text-white rounded-circle p-1 d-flex align-items-center justify-content-center favorite-icon">
                                                    <i class="fa-solid fa-heart-pulse"></i>
                                                </div>
                                            </div>
                                            <div class="contact-background bg-primary rounded-4 col-12 fs-4 d-flex align-items-center justify-content-center text-white">${displayChar(contactList[i])}</div>
                                        </div>
                                        <div>
                                            <h3 class="fs-5">${contactList[i].name}</h3>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="bg-primary bg-opacity-10 py-1 px-2 fit-content rounded-3">
                                                    <i class="fa-solid fa-phone text-primary small"></i>
                                                </div>
                                                <span class="text-secondary fw-medium">${contactList[i].number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-2 d-${contactList[i].email == '' ? `none` : `flex`} align-items-center gap-2">
                                        <div class="bg-main p-1 px-2 rounded-2 fit-content">
                                            <i class="fa-solid fa-envelope text-purple small"></i>
                                        </div>
                                        <span class="text-secondary">${contactList[i].email}</span>
                                    </div>
                                    <div class="pt-2 d-${contactList[i].address == '' ? `none` : `flex`} align-items-center gap-2">
                                        <div class="bg-success bg-opacity-10 p-1 px-2 rounded-2 fit-content">
                                            <i class="fa-solid fa-location-dot text-success small"></i>
                                        </div>
                                        <span class="text-secondary">${contactList[i].address}</span>
                                    </div>
                                    <div class="py-3">
                                        <div class="bg-${groupBackground[contactList[i].group]} bg-opacity-10 p-1 px-2 rounded-2 fit-content d-${contactList[i].group == `select-group` ? `none` : `inline-block`}">
                                            <span class="small text-${groupBackground[contactList[i].group]} fw-medium small">${contactList[i].group}</span>
                                        </div>
                                        <div class="small bg-danger bg-opacity-10 p-1 px-2 rounded-2 fit-content d-${contactList[i].emergency ? `inline-block` : `none`}">
                                            <span class="small text-danger fw-semibold"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="border-top border-1 border-secondary border-opacity-10 pt-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex gap-3">
                                            <a href="tel:${contactList[i].number}" class="text-decoration-none">
                                                <div class="bg-success bg-opacity-10 py-1 px-2 rounded-2 fit-content">
                                                    <i class="fa-solid fa-phone text-success small"></i>
                                                </div>
                                            </a>
                                            <a href="mailto:${contactList[i].email}" class="text-decoration-none d-${contactList[i].email == '' ? 'none' : 'inline-block'}">
                                                <div class="bg-main bg-opacity-10 py-1 px-2 rounded-2 fit-content">
                                                    <i class="fa-solid fa-envelope text-purple small"></i>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="footer-buttons d-flex gap-0 align-items-center">
                                            <button onclick="addFavorite(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-${contactList[i].favorite ? 'solid text-warning' : 'regular text-secondary'} fa-star"></i></button>
                                            <button onclick="addEmergency(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-${contactList[i].emergency ? 'solid fa-heart-pulse text-danger' : `regular fa-heart text-secondary`} "></i></button>
                                            <button onclick="editContact(${i})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="border-0 bg-transparent"><i
                                                    class="fa-solid fa-pen text-secondary"></i></button>
                                            <button onclick="deleteContact(${i})" class="border-0 bg-transparent"><i
                                                    class="fa-solid fa-trash text-secondary"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
        }
    }

    document.getElementById('contacts').innerHTML = term
}

function setValues(index) {
    updateIndex = index

    contactNameInput.value = contactList[index].name
    contactNumberInput.value = contactList[index].number
    contactEmailInput.value = contactList[index].email
    contactAddressInput.value = contactList[index].address
    contactGroupInput.value = contactList[index].group
    contactNotesInput.value = contactList[index].notes
    contactFavorite.checked = contactList[index].favorite
    contactEmergency.checked = contactList[index].emergency
}

function editContact(index) {
    setValues(index)

    addContactBtn.classList.add('d-none');
    updateContactBtn.classList.remove('d-none');

}

function updateContact() {
    var modal = bootstrap.Modal.getInstance(modalElement);

    if (!nameValidation() || !numberValidation() || !emailValidation()) {
        if (contactNameInput.value == '') {
            Swal.fire({
                icon: "error",
                title: "Missing Name",
                text: "Please enter a name for the contact!",
            });
        }
        else if (!nameValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Name",
                text: "Name should contain only letters and spaces (2-50 characters)",
            });
        }
        else if (contactNumberInput.value == '') {
            Swal.fire({
                icon: "error",
                title: "Missing Phone",
                text: "Please enter a phone number!",
            });
        }
        else if (!numberValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Phone",
                text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
            });
        }
        else if (!emailValidation()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address",
            });
        }
        return
    }

    contactList[updateIndex].name = contactNameInput.value,
        contactList[updateIndex].number = contactNumberInput.value,
        contactList[updateIndex].email = contactEmailInput.value,
        contactList[updateIndex].address = contactAddressInput.value,
        contactList[updateIndex].group = contactGroupInput.value,
        contactList[updateIndex].notes = contactNotesInput.value,
        contactList[updateIndex].favorite = contactFavorite.checked,
        contactList[updateIndex].emergency = contactEmergency.checked

    favoriteItems()
    displayFavorite()

    emergencyItems()
    displayEmergency()

    localStorage.setItem('contacts', JSON.stringify(contactList))
    displayContact()

    addContactBtn.classList.remove('d-none');
    updateContactBtn.classList.add('d-none');

    clearForm()
    clearAlerts()
    modal.hide()
    Swal.fire({
        title: "Updated!",
        text: "Contact has been updated successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
    });
}

function storages() {
    if (localStorage.getItem('contacts') !== null) {
        contactList = JSON.parse(localStorage.getItem('contacts'))
        displayContact()
    }
    if (localStorage.getItem('favoriteContacts') !== null) {
        favoriteList = JSON.parse(localStorage.getItem('favoriteContacts'))
        displayFavorite()
    }
    if (localStorage.getItem('emergencyContacts') !== null) {
        emergencyList = JSON.parse(localStorage.getItem('emergencyContacts'))
        displayEmergency()
    }
}