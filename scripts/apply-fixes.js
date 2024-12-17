const fs = require("fs");
const path = require("path");

const fixAndroidManifest = () => {
    const manifestPath = path.resolve(
        __dirname,
        "../node_modules/@react-native-voice/voice/android/src/main/AndroidManifest.xml"
    );

    if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, "utf8");
        manifestContent = manifestContent.replace(
            '<application',
            '<application android:usesCleartextTraffic="true" tools:replace="android:usesCleartextTraffic"'
        );
        fs.writeFileSync(manifestPath, manifestContent, "utf8");
        console.log("AndroidManifest.xml fixed successfully!");
    } else {
        console.error("AndroidManifest.xml not found.");
    }
};

fixAndroidManifest();
