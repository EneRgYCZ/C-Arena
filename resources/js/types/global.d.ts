import { AxiosInstance } from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { route as ziggyRoute } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: typeof Pusher;
        Echo: Echo;
    }

    let route: typeof ziggyRoute;
}
