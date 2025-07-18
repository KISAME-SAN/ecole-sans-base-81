const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Construction de l\'exécutable École Sans Base...\n');

try {
  // Étape 1: Build de l'application React
  console.log('📦 Build de l\'application React...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build React terminé\n');

  // Étape 2: Vérification que le dossier dist existe
  if (!fs.existsSync('./dist')) {
    throw new Error('Le dossier dist n\'existe pas. Le build React a échoué.');
  }

  // Étape 3: Création du package temporaire pour Electron
  console.log('⚙️  Configuration d\'Electron...');
  
  const packageJson = {
    name: "ecole-sans-base",
    version: "1.0.0",
    description: "Système de gestion d'établissement scolaire",
    main: "electron.js",
    scripts: {
      "start": "electron ."
    },
    devDependencies: {
      "electron": "^37.2.2"
    }
  };

  // Sauvegarde du package.json original
  const originalPackage = fs.readFileSync('./package.json', 'utf8');
  
  // Création du package.json temporaire pour Electron
  fs.writeFileSync('./package-electron.json', JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Configuration Electron terminée\n');

  // Étape 4: Build avec electron-builder
  console.log('🔨 Création de l\'exécutable...');
  try {
    execSync('npx electron-builder --config electron-builder.json --win', { stdio: 'inherit' });
    console.log('✅ Exécutable créé avec succès!');
    console.log('📁 Votre fichier .exe se trouve dans le dossier: dist-electron/');
  } catch (builderError) {
    console.log('⚠️  Tentative avec configuration simplifiée...');
    
    // Configuration simplifiée
    const simpleConfig = {
      appId: "com.ecole-sans-base.app",
      productName: "École Sans Base",
      directories: {
        output: "dist-electron"
      },
      files: [
        "dist/**/*",
        "electron.js"
      ],
      win: {
        target: "portable",
        icon: "public/favicon.ico"
      }
    };

    fs.writeFileSync('./electron-builder-simple.json', JSON.stringify(simpleConfig, null, 2));
    execSync('npx electron-builder --config electron-builder-simple.json --win', { stdio: 'inherit' });
    console.log('✅ Exécutable portable créé avec succès!');
    console.log('📁 Votre fichier .exe se trouve dans le dossier: dist-electron/');
  }

} catch (error) {
  console.error('❌ Erreur lors de la construction:', error.message);
  console.log('\n💡 Solutions possibles:');
  console.log('1. Assurez-vous que Node.js et npm sont installés');
  console.log('2. Exécutez: npm install');
  console.log('3. Essayez: npm run build puis npx electron .');
} finally {
  // Nettoyage des fichiers temporaires
  if (fs.existsSync('./package-electron.json')) {
    fs.unlinkSync('./package-electron.json');
  }
  if (fs.existsSync('./electron-builder-simple.json')) {
    fs.unlinkSync('./electron-builder-simple.json');
  }
}