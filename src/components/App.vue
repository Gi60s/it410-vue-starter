<template>
    <div id="app" :class="{ loaded: loaded }">
        <form method="POST" action="/api/users/login" v-if="!user">
            <p>Username: <input type="text" name="username"></p>
            <p>Password: <input type="password" name="password"></p>
            <p><input type="submit"></p>
        </form>
        <p v-else><button @click="logout()">Log Out {{user.username}}</button></p>
        
        <!-- this content is route based -->
        <div id="content-area">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            this.getInitData();
            return {
                loaded: false,
                friends: [],
                user: null
            }   
        },
        methods: {
            getInitData: function () {
                fetch('/api/init', { credentials: 'same-origin' })
                    .then(response => response.json())
                    .then(data => {
                        this.friends = data.friends;
                        this.user = data.user;
                        this.loaded = true;
                    });
            },
            logout: function() {
                window.location = '/api/users/logout';
            }
        }
    }
</script>

<style scoped>
    #app {
        opacity: 0;
        transition: opacity 300ms ease-out;
    }
    #app.loaded {
        opacity: 1;
    }
</style>