<h1 align="left">Plastic Origin labelcv-web</h1>

<a href="https://www.plasticorigins.eu/"><img width="80px" src="https://github.com/surfriderfoundationeurope/The-Plastic-Origins-Project/blob/master/assets/PlasticOrigins_logo.png" width="5%" height="5%" align="left" hspace="0" vspace="0"></a>

  <p align="justify">Proudly Powered by <a href="https://surfrider.eu/">SURFRIDER Foundation Europe</a>, this open-source initiative is a part of the <a href="https://www.plasticorigins.eu/">PLASTIC ORIGINS</a> project - a citizen science project that uses AI to map plastic pollution in European rivers and share its data publicly. Browse the <a href="https://github.com/surfriderfoundationeurope/The-Plastic-Origins-Project">project repository</a> to know more about its initiatives and how you can get involved. Please consider starring :star: the project's repositories to show your interest and support. We rely on YOU for making this project a success and thank you in advance for your contributions.</p>

_________________

<!--- OPTIONAL: You can add badges and shields to reflect the current status of the project, the licence it uses and if any dependencies it uses are up-to-date. Plus they look pretty cool! You can find a list of badges or design your own at https://shields.io/ --->

Welcome to **Plastic Origin labelcv-web** - a Web UI for Label CV platform - the source code of [Trashroulette](https://www.trashroulette.com/#/) used to manually annotate images.  It can be used to build datasets of labelled images featuring items of interest in order to train an artificial intelligence model to detect and count those items. At Surfrider, we're labeling litter items.

## **Getting Started**

### **Prerequisites**

Before you begin, ensure you have met the following requirements:

* You have installed [`Node.js 13 or latest`](https://nodejs.org/en/download/)

#### **Technical stack**
* Language: `javascript` and `typescript`
* Framework: `Vue` and `Vuex`
* Unit test framework: `Jest`
* Linter : `eslint`

### **Installation**

To **INSTALL FRONT**, follow these steps:
 ```
git clone https://github.com/surfriderfoundationeurope/labelcv-web
cd
git fetch 
git checkout refacto-from-develop
```

To **LAUNCH FRONT**:
```
npm install 
npm run serve
```

### **Usage**

There are three different usage possible : 
- In development with in memory images and trash-types : nothing special to do, it will fall back to this mode if no config files are found. 
- In development with a local API : 
  1. Follow the instruction on how to launch LabelCV backend described in the [Additional information](##Additionalinformation) section at the end of this README. 
  2. create a file `./public/config.prod.json` with `{"url": "http://localhost:443/" }`
- In production : create a file `./public/config.prod.json` with `{"url": "path/to/labelCV/api" }`
 
<!--- If needed add here any Extra Sections (must have their own titles).Specifically, the Security section should be here if it wasn't important enough to be placed above.-->

## **Contributing**

It's great to have you here! We welcome any help and thank you in advance for your contributions.

* Feel free to **report a problem/bug** or **propose an improvement** by creating a [new issue](https://github.com/surfriderfoundationeurope/labelcv-web/issues). Please document as much as possible the steps to reproduce your problem (even better with screenshots). If you think you discovered a security vulnerability, please contact directly our [Maintainers](##Maintainers).

* Take a look at the [open issues](https://github.com/surfriderfoundationeurope/labelcv-web/issues) labeled as `help wanted`, feel free to **comment** to share your ideas or **submit a** [**pull request**](https://github.com/surfriderfoundationeurope/labelcv-web/pulls) if you feel that you can fix the issue yourself. Please document any relevant changes.

>*If you're part of Surfrider Foundation, you can make a branch out of `develop` and when your work is ready, open a Pull Request from your branch to `develop` that should be reviewed by someone else ! 
Otherwise, you can also create a pull request from a fork as explained [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).*
```
git checkout -b develop/{custom-name}
git commit -m ...
git push 
```

>*And then, you can do a PR from your branch to branch 
`develop`.*

## **Maintainers**

If you experience any problems, please don't hesitate to ping:
<!--- Need to check the full list of Maintainers and their GIThub contacts -->
* [@cmaneu](https://github.com/cmaneu)
* [@bertrandlalo](https://github.com/bertrandlalo)

Special thanks to all our [Contributors](https://github.com/orgs/surfriderfoundationeurope/people).

## **License**

We’re using the `MIT` License. For more details, check [`LICENSE`](https://github.com/surfriderfoundationeurope/labelcv-web/blob/master/LICENSE) file.

## **Additional information**

<details>
<summary>Check here how to install and launch our BACK</summary>

To **INSTALL BACK**:
Make sure you have a `Node` version between 12 and 13. You can use [`nvm`](https://github.com/nvm-sh/nvm) to manage the Node versions. 

```
git clone https://github.com/surfriderfoundationeurope/LabelCV
cd LabelCV
git fetch 
git checkout dev
cd api/labelcv-api
```
Create a .env file in `api/labelcv-api` and copy-paste 
(Fields with ***** are private and their content 
should be asked to Antoine or Christopher ) 
```
COSMOSDB_ENDPOINT=https://labelcvdemo.documents.azure.com:443
COSMOSDB_KEY=********
API_PORT=443
AZURE_STORAGE_SAS_KEY=********
AZURE_STORAGE_ACCOUNT=labelcvdevdemo
AZURE_STORAGE_CONTAINER_NAME=labelcvdemo1
COSMOSDB_EMULATOR_USED=true
AZURE_TEST_ENV=********
AZURE_ACCOUNT_NAME=storageplasticodev
AZURE_ACC_KEY=********
PG_IMG_TABLE=images_for_labelling
PG_TRASH_TABLE=campaign.trash_type
PG_LABEL_SCHEMA=label
PG_BOUNDINGBOX_TABLE=bounding_boxes
PG_DATABASE=plastico-dev
PG_USERNAME=writer_user@pgdb-plastico-dev
PG_PWD=********
PG_HOST=pgdb-plastico-dev.postgres.database.azure.com
```

To **LAUNCH BACK**:
```
cd api/labelcv-api
npm install 
npm run start:dev
```
You should get message `Client Postgres connected !`

</details>
