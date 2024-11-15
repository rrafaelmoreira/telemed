<template>
    <div>
        <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
            <router-link class="navbar-brand" to="/">Vue Firebase</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/home">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/register">Register</router-link>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        </header>
    </div>
</template>