#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

cd /opt
git clone https://github.com/gganster/stress-test2.git
cd stress-test2
npm install

cat > /etc/systemd/system/stress-test2.service << EOF
[Unit]
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/stress-test2/index.js
Restart=always
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
EOF

systemctl enable stress-test2
systemctl start stress-test2
