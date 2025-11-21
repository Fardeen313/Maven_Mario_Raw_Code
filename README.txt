Mario Game - Ready-to-build Maven WAR archetype
==============================================

What is included:
- Maven project structure (pom.xml)
- src/main/webapp/index.jsp -> entry page (loads Phaser from CDN)
- src/main/webapp/assets/js/app.js -> Phaser 3 platformer game (works on mobile + desktop)
- src/main/webapp/assets/images/bg.png -> your uploaded background image
- src/main/webapp/assets/images/player_sprites.png -> placeholder player spritesheet
- src/main/webapp/assets/images/tiles.png -> placeholder tiles (ground, pipe, brick)
- basic App.java and web.xml

How to build:
1. On your machine (with Maven installed), unzip and run:
   mvn clean package
2. The WAR will be created at: target/mario-game.war
3. Deploy the WAR to Tomcat's webapps directory:
   cp target/mario-game.war /path/to/tomcat/webapps/
4. Open in browser:
   http://YOUR_SERVER:8080/mario-game/

Notes:
- The game uses Phaser from CDN so an internet connection is required to load Phaser.
- If you want Phaser included locally, replace the CDN script in index.jsp with a local phaser.min.js in assets/js and update paths.
- Replace player_sprites.png and tiles.png with better art if you want a more authentic Mario look.

Have fun! If you want, I can:
- Replace placeholders with open-source pixel art sprites,
- Add sound effects and music,
- Expand levels and add scoring/lives.
