#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Setup Paths
const ALIAS_DIR = path.join(os.homedir(), '.npx-aliases');
const REGISTRY_PATH = path.join(ALIAS_DIR, 'registry.json');
const isWindows = os.platform() === 'win32';

// Ensure directory and registry exist
if (!fs.existsSync(ALIAS_DIR)) fs.mkdirSync(ALIAS_DIR, { recursive: true });
if (!fs.existsSync(REGISTRY_PATH)) fs.writeFileSync(REGISTRY_PATH, JSON.stringify({}, null, 2));

// Parse CLI Arguments
const args = process.argv.slice(2);
const command = args[0];
const pkgName = args[1];
const restArgs = args.slice(2);

// Helper function to create wrapper scripts
function createWrapper(targetName, npxPackage) {
    if (isWindows) {
        const cmdPath = path.join(ALIAS_DIR, `${targetName}.cmd`);
        fs.writeFileSync(cmdPath, `@echo off\nnpx -y ${npxPackage} %*\n`);
    } else {
        const shPath = path.join(ALIAS_DIR, targetName);
        fs.writeFileSync(shPath, `#!/bin/bash\nnpx -y ${npxPackage} "$@"\n`);
        fs.chmodSync(shPath, 0o755); // Make it executable
    }
}

// Helper function to remove wrapper scripts
function removeWrapper(targetName) {
    const targetPath = isWindows ? path.join(ALIAS_DIR, `${targetName}.cmd`) : path.join(ALIAS_DIR, targetName);
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
}

// Load Registry
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// Command Logic
switch (command) {
    case 'add':
        if (!pkgName || restArgs.length === 0) {
            console.log("\x1b[33m%s\x1b[0m", "Usage: fpx add <package-name> [as <alias>] <description>");
            process.exit(1);
        }

        let alias = null;
        let descArgs = restArgs;

        if (restArgs[0] === 'as' && restArgs.length >= 2) {
            alias = restArgs[1];
            descArgs = restArgs.slice(2);
        }
        const description = descArgs.join(' ');

        // Create main wrapper and alias wrapper
        createWrapper(pkgName, pkgName);
        if (alias) createWrapper(alias, pkgName);

        // Update Registry
        registry[pkgName] = { description, alias };
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

        console.log("\x1b[32m%s\x1b[0m", `✅ Added '${pkgName}' to your npx aliases!`);
        if (alias) console.log("\x1b[36m%s\x1b[0m", `🔗 Alias '${alias}' is also ready to use.`);
        break;

    case 'remove':
        if (!pkgName) {
            console.log("\x1b[33m%s\x1b[0m", "Usage: fpx remove <package-name or alias>");
            process.exit(1);
        }

        let targetPkg = null;
        let targetAlias = null;

        // Find the package or alias
        for (const [key, val] of Object.entries(registry)) {
            if (key === pkgName || (val.alias && val.alias === pkgName)) {
                targetPkg = key;
                targetAlias = val.alias;
                break;
            }
        }

        if (!targetPkg) {
            console.log("\x1b[33m%s\x1b[0m", `⚠️ Could not find '${pkgName}' in your registry.`);
            process.exit(1);
        }

        removeWrapper(targetPkg);
        if (targetAlias) removeWrapper(targetAlias);

        delete registry[targetPkg];
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

        console.log("\x1b[32m%s\x1b[0m", `🗑️ Successfully removed '${targetPkg}' from your system.`);
        break;

    case 'list':
        console.log("\x1b[36m%s\x1b[0m", "📦 Your NPX Aliases:");
        console.log("\x1b[36m%s\x1b[0m", "--------------------");

        const entries = Object.entries(registry);
        if (entries.length === 0) {
            console.log("\x1b[90m%s\x1b[0m", "No aliases found.");
        } else {
            entries.forEach(([key, val]) => {
                const aliasStr = val.alias ? `\x1b[33m(alias: ${val.alias})\x1b[0m ` : '';
                console.log(`\x1b[32m${key}\x1b[0m ${aliasStr}- ${val.description || val}`);
            });
        }
        break;

    default:
        console.log("Usage:");
        console.log("  fpx add <package> [as <alias>] <description>  - Registers a new npx wrapper");
        console.log("  fpx remove <package or alias>                 - Deletes wrappers and registry entry");
        console.log("  fpx list                                      - Shows all your registered packages");
        break;
}