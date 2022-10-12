echo "Running Release Tasks"

echo "Running Migrations"
ENV_SILENT=true npm run migrate

echo "Refreshing Migrations"
#ENV_SILENT=true npm run migrate:reset

echo "Done"
web: ENV_SILENT=true npm start