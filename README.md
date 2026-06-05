# RPG-Cobo

![Editor Image](rpgcobo-logo.png)

[⇒ Japanese](README.ja.md)

## 🎮 Multi-platform and multi-language compatible 3D-RPG development tool

RPG-Cobo is an AI-compatible open source RPG production tool that allows anyone to easily create 3D-RPGs.  
Equipped with a map editor using high-resolution voxels, a no-code event editor, AI translation, etc., and can be exported to the Web / Windows / Android / iOS.

![Editor Image](rpgcobo-top.webp)

---

## ✨ Main features

- **High-quality map representation in HD-2D style**
  High-resolution voxels and the latest rendering technology make it easy to create beautiful maps with depth.

- **Create events with no code**
  You can intuitively assemble the processes necessary for an RPG, such as conversations, treasure chests, switches, cutscenes, etc.

- **Multilingual support by AI translation**
  Multilingualize the entire game with just one click. You can publish your work to the world.

- **Supports AI voice generation**
  Supports natural voice generation using Google AI Studio. (API key required)

- **Multi-platform output**
  Can be exported to Web / Windows / Android / iOS.

- **Completely open source (Apache-2.0)**
  You can freely use, modify, and redistribute everything, including the tool itself, game runtime, and default materials.

---

## 📦 Repository configuration

RPG-Cobo consists of multiple repositories.

- **rpgcobo-tool**  
  Tool body (editor/game runtime)

- **rpgcobo-portal**  
  Project management app (app installed on your PC)

- **rpgcobo-web**  
  Official website and documentation

- **rpgcobo-assets**  
  Default materials/templates

---

## 🛠️ How to do it
### 1. Download/Install (recommended)
You can download the latest stable version of **Portal app installer** from the RPG-Cobo official website:
```
👉 https://rpg-cobo.com/download （For Windows）
```
### 2. Launch from the portal app repository (recommended)
**Portal app** can also be cloned from GitHub.
1. [rpgcobo-portal](https://github.com/djkotori/rpgcobo-portal) clone
2. `rpgcobo-portal.exe` execute  
3. Create a project on the portal app and start RPG-Cobo

### 3. Start from the tool's repository
Click here if you want to directly operate the tool itself for development purposes.
1. [rpgcobo-tool](https://github.com/djkotori/rpgcobo-tool) clone  
2. `rpgcobo.exe` execute
3. Game resources will be downloaded when you start up for the first time.

※ `rpgcobo-tool` is useful when you want to operate in HEAD state.  
　For normal use, we recommend starting from the portal app.

### 4. Game engine/native code (C++)
A detailed explanation of the tools and game runtime native code (C++) will be published in a document at a later date.

## 🤝 Contribution
Issues/Pull Requests are welcome.
Please feel free to participate by reporting bugs, suggesting improvements, developing plugins, etc.

## ✒️ License
RPG-Cobo is released under the Apache-2.0 License.
It can be used freely for both commercial and non-commercial purposes.

## 🌐 Official website

```
(Coming soon)
https://rpg-cobo.com
```
