class Github {
    static http() {
        return class {
            static URL = 'https://api.github.com/repos/langprogramming-AsmX/AsmX';
  
            static get(route) {
                return fetch(`${this.URL}${route}`, { method: 'GET' }).then(response => response.json());
            }
        }
    }
  
  
    static async releases() {
        return this.http().get('/releases');
    }
  
  
    static async stargazers() {
        return this.http().get('/stargazers');
    }
  
  
    static tags() {
        return this.http().get('/tags');
    }
  
    static fork() {
        return this;
    }
  
  
    static async readme() {
        return await fetch ('https://raw.githubusercontent.com/langprogramming-AsmX/AsmX/main/README.md', { method: 'GET' }).then(r => r.text())
    }
}

module.exports = Github;