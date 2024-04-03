College/Department Blogging Platform
Welcome to the College/Department Blogging Platform! This platform serves as a centralized hub for sharing insights, experiences, and resources within our college or department community.

Features
Dynamic Sections: Explore various sections covering academic resources, career services, campus life, culture, social activities, sports, health and wellness, technology, travel, alumni updates, and more.
User Engagement: Users can create posts, share their stories, and engage in discussions with fellow community members.
Intuitive Navigation: Easy-to-use navigation allows users to seamlessly browse through different sections and posts.
Responsive Design: The platform is designed to be responsive, ensuring optimal viewing experience across devices.
Getting Started
To get started with the College/Department Blogging Platform, follow these steps:

1. _Elasticsearch Setup_
   Download Elasticsearch: Download the Elasticsearch package from this link.
   **https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.18-darwin-x86_64.tar.gz**

Extract Files: Extract the downloaded file to your desired location.

Start Elasticsearch: Open a terminal, navigate to the extracted Elasticsearch directory, and run the following command:

./bin/elasticsearch
This command will start Elasticsearch.

2. **Backend Setup**
   Install Dependencies: Install the required dependencies using npm or yarn. Run the following command:

npm install

Start Node Server: Navigate to the 'node' directory and start the server to serve the blog data:

cd node
node elasticsearch.js
The server runs on http://localhost:3001.

3. **Frontend Setup**
   Run the Application: Open another terminal, navigate to the root directory of the project, and start the development server to run the blogging platform locally:

npm start

The application should now be running on http://localhost:3000.

4. **Credentials**
   Please use the below credentials for testing:

Student: Username: Karan | Password: password
Moderator: Username: Moderator | Password: password
Admin: Username: Admin | Password: admin
Contributing
Contributions to the College/Department Blogging Platform are welcome! Here's how you can contribute:

**Fork the repository.**
Create a new branch for your feature or bug fix.
Make your changes and ensure the code passes all tests.
Commit your changes and push to your fork.
Open a pull request to the main repository.
Feel free to explore, contribute, and engage with the community on the College/Department Blogging Platform!
