FROM quay.io/keycloak/keycloak:24.0.1
COPY fitness-oauth2-realm.json /opt/keycloak/data/import/fitness-oauth2-realm.json
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]
