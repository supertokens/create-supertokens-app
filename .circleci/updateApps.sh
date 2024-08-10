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

git add --all
git commit -m "updates to example apps"
git push