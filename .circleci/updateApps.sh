git clone https://github.com/supertokens/live-apps.git

cd live-apps 

rm -rf emailpassword
npx create-supertokens-app@latest --frontend=next-app-directory --recipe=emailpassword --appname=emailpassword
if [ -d "emailpassword" ]; then
    cd emailpassword
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://emailpassword.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: emailpassword directory not created"
    exit 1
fi

rm -rf thirdpartyemailpassword
npx create-supertokens-app@latest --frontend=next-app-directory --recipe=thirdpartyemailpassword --appname=thirdpartyemailpassword
if [ -d "thirdpartyemailpassword" ]; then
    cd thirdpartyemailpassword
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://thirdpartyemailpassword.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: thirdpartyemailpassword directory not created"
    exit 1
fi

rm -rf thirdparty
npx create-supertokens-app@latest --frontend=next-app-directory --recipe=thirdparty --appname=thirdparty
if [ -d "thirdparty" ]; then
    cd thirdparty
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://thirdparty.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: thirdparty directory not created"
    exit 1
fi

rm -rf passwordless
npx create-supertokens-app@latest --frontend=next-app-directory --recipe=passwordless --appname=passwordless
if [ -d "passwordless" ]; then
    cd passwordless
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://passwordless.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: passwordless directory not created"
    exit 1
fi

rm -rf thirdpartypasswordless
npx create-supertokens-app@latest --frontend=next-app-directory --recipe=thirdpartypasswordless --appname=thirdpartypasswordless
if [ -d "thirdpartypasswordless" ]; then
    cd thirdpartypasswordless
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://thirdpartypasswordless.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: thirdpartypasswordless directory not created"
    exit 1
fi

rm -rf dashboard-demo
npx create-supertokens-app@latest --dashboardDemo=true
if [ -d "dashboard-demo" ]; then
    cd dashboard-demo
    find . -type f -not -path '*/node_modules/*' -exec sed -i 's|http://localhost:3000|https://dashboard.demo.supertokens.com|g' {} +
    cd ../
else
    echo "Error: dashboard-demo directory not created"
    exit 1
fi

git config --global user.email "$EMAIL"
git config --global user.name "$NAME"

git add --all
git commit -m "updates to example apps"
git push