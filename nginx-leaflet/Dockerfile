FROM nginx:1.27
#MAINTAINER James Badger <james@jamesbadger.ca>

ADD ./preconfigure.sh /preconfigure.sh
COPY dist /usr/share/nginx/html
ADD ./dng_map.js /usr/share/nginx/html/dng_map.js

CMD ./preconfigure.sh
