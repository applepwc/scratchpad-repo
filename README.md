# Scratchpad Web Application

This is a simple web application that provides a scratchpad for users to edit and save content. The application is built using Python and Flask for the backend, and HTML and JavaScript for the frontend.

## How to Run the Flask Application

1. Clone the repository:
    ```
    git clone https://github.com/githubnext/workspace-blank.git
    cd workspace-blank
    ```

2. Install the required dependencies:
    ```
    pip install -r requirements.txt
    ```

3. Create a `templates` directory and move the `index.html` file into it:
    ```
    mkdir templates
    mv index.html templates/
    ```

4. Run the Flask application:
    ```
    python app.py
    ```

5. Open your web browser and navigate to `http://127.0.0.1:5000/` to access the scratchpad.

## How to Use the Scratchpad

1. Open the web application in your browser.
2. Edit the content in the textarea provided.
3. Click the "Save" button to save the content to a text file.
4. A message will be displayed indicating that the content has been saved successfully.

## Requirements

The following dependencies are required to run the Flask application:

- Flask==2.0.1
