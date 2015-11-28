from setuptools import setup, find_packages

setup(
    name = "Helene",
    desciption = "Status monitor",
    version = "1.0.8",
    author = 'Lajos Santa',
    author_email = 'santa.lajos@coldline.hu',
    install_requires = [
        "Flask==0.10.1",
        "transmissionrpc==0.11",
        "lxml==3.4.4",
        "SQLAlchemy==1.0.8",
        "MySQL-python==1.2.5",
        "phpserialize==1.3",
    ],
    include_package_data = True,
    packages = find_packages(),
)
