# Easily kill process on port because sometimes nodemon fails to reboot
kill -9 $(lsof -t -i tcp:5000)