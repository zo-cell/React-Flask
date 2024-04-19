export default class APIService {
  // Members Cruds:
  static UpdateMember(id, info) {
    return fetch(`http://127.0.0.1:5000/api/update/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static InsertUser(info) {
    return fetch('http://127.0.0.1:5000/api/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static login(info) {
    return fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static signOut() {
    return fetch('http://127.0.0.1:5000/api/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Send an empty JSON object in the request body
    })
      .then((response) => {
        if (response.ok) {
          console.log('Session has been cleared');
        } else {
          console.log('Failed to clear session');
        }
      })
      .catch((err) => console.log(err));
  }

  static DeleteUser(id) {
    return fetch(`http://127.0.0.1:5000/api/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // =================================================================:
  // Workers Cruds:

  static InsertWorker(info) {
    return fetch('http://127.0.0.1:5000/api/workers/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static WorkerLogin(info) {
    return fetch('http://127.0.0.1:5000/api/workers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static UpdateWorker(id, info) {
    return fetch(`http://127.0.0.1:5000/api/workers/update/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static DeleteWorker(id) {
    return fetch(`http://127.0.0.1:5000/api/workers/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // =================================================================:
  // Workers Cruds:

  static InsertOrder(info) {
    return fetch('http://127.0.0.1:5000/api/AddOrders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }


  static GetOrder(id) {
    return fetch(`http://127.0.0.1:5000/api/order/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => response.json());
  }


  static UpdateOrder(id, info) {
    return fetch(`http://127.0.0.1:5000/api/orders/update/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }

  static DeleteOrder(id) {
    return fetch(`http://127.0.0.1:5000/api/order/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ==================================================================
  // Jobs Cruds:
  static DeleteJob(id) {
    return fetch(`http://127.0.0.1:5000/api/Jobs/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }


  // ==================================================================
  // Service Cruds:

  static UpdateService(id, info) {
    return fetch(`http://127.0.0.1:5000/api/service/update/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }



  static DeleteService(id) {
    return fetch(`http://127.0.0.1:5000/api/service/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }


  // ==================================================================
  // Customers Cruds:

  static InsertCustomer(info) {
    return fetch('http://127.0.0.1:5000/api/AddCustomers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }


  static UpdateCustomer(id, info) {
    return fetch(`http://127.0.0.1:5000/api/customers/update/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }



  static DeleteCustomer(id) {
    return fetch(`http://127.0.0.1:5000/api/customers/delete/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ==================================================================
  // Branches Cruds:

  static InsertBranch(info) {
    return fetch('http://127.0.0.1:5000/api/AddBranch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).then((response) => response.json());
  }
}

