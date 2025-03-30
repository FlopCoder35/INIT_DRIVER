from flask import Flask, request, render_template, jsonify  
import numpy as np
import pandas as pd
import pickle
import os


app = Flask(__name__, template_folder=os.getcwd(), static_folder=os.getcwd())




if __name__ == '__main__':

    app.run(debug=True)