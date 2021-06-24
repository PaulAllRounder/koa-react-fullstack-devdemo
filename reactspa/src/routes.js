/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index.js";
import Login from './views/Login';
import Register from './views/Register';
import UserProfile from './views/Profile';
import PetsList from './views/PetsList';
import MyPets from './views/MyPets';

const routes = [
  {
    path: "/index",
    barName: "Overview",
		name: 'Public',
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/main",
  },
  {
    path: "/pets",
		barName: "All Pets",
    name: 'Auth Need',
    icon: "ni ni-bullet-list-67 text-blue",
    component: PetsList,
    layout: "/main",
  },
  {
    path: "/my-pets",
		barName: "My Pets",
    name: 'Auth Need',
    icon: "ni ni-tie-bow text-orange",
    component: MyPets,
    layout: "/main",
  },
  {
    path: "/user-profile",
		barName: "My Profile",
    name: 'Auth Need',
    icon: "ni ni-single-02 text-yellow",
    component: UserProfile,
    layout: "/main",
  },
  {
    path: "/login",
    name: "",
		barName: 'Login',
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "",
		barName: 'Register',
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];
export default routes;
