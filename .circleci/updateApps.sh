git clone https://github.com/supertokens/live-apps.git

cd live-apps 

rm -rf emailpassword
npx -y create-supertokens-app@latest --frontend=next-app-directory --recipe=emailpassword --appname=emailpassword
cd emailpassword
find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://emailpassword.demo.supertokens.com|g' {} +
cd ../

rm -rf thirdpartyemailpassword
npx -y create-supertokens-app@latest --frontend=next-app-directory --recipe=thirdpartyemailpassword --appname=thirdpartyemailpassword
cd thirdpartyemailpassword
find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://thirdpartyemailpassword.demo.supertokens.com|g' {} +
cd ../