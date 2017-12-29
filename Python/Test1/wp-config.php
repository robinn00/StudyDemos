<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */
define('WPLANG','zh_CN');
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wzcdzcn');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'Meishi123Qwe');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'L?G)Ul4-rZ:~Yu2KeaqA|):d2||a}<}q0*>~J5B!:/0Fn]Vw|ft-vy7ydN,-X+F?');
define('SECURE_AUTH_KEY',  '+{N-5z^gL+!5^Qy^o/Or0O~hN~1Wfxx_+^ug1j41q_H8l=A-GY9!V}qIrr.Oo%V*');
define('LOGGED_IN_KEY',    'o}`3OYYI@ar+pihY0hO>wMMdOQ)[KVvL0:D$4=3ns+]H?yAQB>r.o Z-26YGs@.{');
define('NONCE_KEY',        'R.?A22ZWA!J+k{cpxxo+NR/|3((.a-)[,-yd.ATyi3_o{!%`u5(.#?xS{-dS4}nz');
define('AUTH_SALT',        'wl>||O?}|w4i.*e-yV?){Y&2)nd,@s1pqnZYs=E~3jj-#0yt5+oaP#pdz7]bNvsn');
define('SECURE_AUTH_SALT', '%7Gy!O5+3@4[4u%9/Ik%YiC|9W$R|Kn@Fueb-a@x=#uPCS;Hh`0b!*r?RdrCa,k(');
define('LOGGED_IN_SALT',   '(w_Gy_nm2!6x%O>vk:vzvKS:s!9u+4M)eJ`*tPU6B0Nl+||v0y25N/HKJn-@d{ug');
define('NONCE_SALT',       '+9t* dCmelQ$n+{j4Mow]<K_a_@{pY|YfJM;TwYBmFX}#l^S+@HU~$b<]j&mi+<v');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
define('WPLANG','zh_CN');
