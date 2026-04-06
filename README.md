# fpx 🚀
[![npm version](https://img.shields.io/npm/v/fpx-now.svg?color=blue)](https://www.npmjs.com/package/fpx-now)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A lightweight manager for caching and aliasing your frequently used one-off `npx` commands.

Tired of typing out full `npx` package names and arguments for tools you only use occasionally? `fpx` acts as a personal package manager for `npx`. It allows you to create global aliases for npx tools, complete with descriptions, so you can run them like native terminal commands without permanently installing them on your machine.

🌐 **[Read the Official Documentation](https://fpx.mehdiacho.tech)**

---

## Installation

Install the CLI globally via npm:

```bash
npm install -g fpx-now
```

## Usage

Once installed, you can use the `fpx` command anywhere in your terminal.

### 1. Add a new package

Register a tool to your local cache. You can optionally assign it a shorter alias.

```bash
# Standard usage
fpx add cowsay "Draws an ASCII cow in the terminal"

# With a custom alias
fpx add port-whisperer as ports "Manages local ports and tasks"
```

### 2. Run your tools

Once added, simply run the package name (or its alias) directly in your terminal, exactly as you would any native command. All arguments are seamlessly passed to `npx`.

```bash
ports --kill 3000
```

### 3. List your tools

Forget what tools you have stashed away? List them all, along with their descriptions.

```bash
fpx list
```

Output:

```plaintext
📦 Your NPX Aliases:
--------------------
cowsay - Draws an ASCII cow in the terminal
port-whisperer (alias: ports) - Manages local ports and tasks
```

### 4. Remove a tool

Clean up your system by removing the wrapper and registry entry. You can delete it using either the package name or the alias.

```bash
fpx remove ports
```

## How it Works

`fpx` creates tiny, lightweight wrapper scripts (`.cmd` on Windows, Bash on Mac/Linux) in a hidden `~/.npx-aliases` directory and adds them to your system path. When executed, these wrappers tell `npx` to silently download the tool to its temporary cache and run it instantly.

## Author

Built by Mehdi Acho.

## License

MIT
