/*Application  */
app/                    	--> all of the source files for the application.

core/		
	-controllers/
	     schedular			--> scheduling crawler definitions.
		 crawlerManagement 	--> view and update crawler definitions.
		 dashboard   		--> Application landing page.
		 login				--> Handles login Flow.
		 navigation			--> Navigates between left side menu bar.
		 visualcrawler 		--> Future implementation.
		 
	-factories/				--> Application services.
	-models/				--> future implementation.
	-modules/				--> not used(future implementation).
	
resoures/					--> Application related custom css,images,js,json skeleton.

vendors/					--> External libraries.

views/						--> Html for schedular, crawlerManagement, dashboard, login, navigation, visualcrawler.

/*chrome Extension  */

chromeExtn/
		chromeExtnResources/
			contentScript.js			--> responsible for loading the chrome extension in an iframe.
			UiHandler.js				--> responsible for all the actions and communicating between extension and application.
					
		common/							--> future implementation.
		
		core/							--> Messenger and application JSON skeleton.
		
		resources/						--> extension related custom css,images,js.
		
		vendors/						--> External libraries.
		
		views/							--> Html for crawler form and iframe.