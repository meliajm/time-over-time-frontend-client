class Api {
    // static base_url = 'http://localhost:3000'
    static base_url = 'https://time-over-time.herokuapp.com'

    static options = {
        credentials: 'include'
    }
    static headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    static get(url) {
        return fetch(this.base_url+url, this.options)
        .then(response => response.json())
    }

    static logout(url) {
        return fetch(this.base_url+url, this.options)
        .then(response => {
            return response.text()
        })
        .then((data) => {
            return (data ? JSON.parse(data) : {})
        })
    }

    static post(url, body) {
        return fetch(this.base_url+url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
            ...this.options
        })
        .then(response=>response.json())
    }

    static delete(url) {
        return fetch(this.base_url+url, {
            method: 'DELETE',
            headers: this.headers
        })
    }

    static patch(url, body) {
        return fetch(this.base_url+url, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(body)
        })
        .then(response=>response.json())
    }
}

