To run on local machine create a new vhost (could look like this)

 sudo vi /etc/apache2/extra/httpd-vhosts.conf

<VirtualHost *:80>
   DocumentRoot "/Users/bo/Sites/falcon/web"
   ServerName falcon.dev
   ErrorLog "/private/var/log/apache2/falcon.dev-error_log"
   CustomLog "/private/var/log/apache2/falcon.dev-access_log" common

   # This should be omitted in the production environment
   SetEnv APPLICATION_ENV development

   <Directory "/Users/bo/Sites/falcon/web">
       Options Indexes MultiViews FollowSymLinks
       AllowOverride All
       Order allow,deny
       Allow from all
   </Directory>
</VirtualHost>


-----------------------------------

Remember to add host in hosts
sudo vi /etc/hosts

127.0.0.1       falcon.dev

-----------------------------------

Restart apache

sudp apachectl restart


-----------------------------------

NOTICE:
What ever you set your domain to, you have to set the same value in app/Config.php -> redirectUrl' => "http://falcon.dev:80/"
