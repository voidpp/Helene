from setuptools import setup, find_packages

setup(
    name = "Helene",
    desciption = "Status monitor",
    version = "1.7.1",
    author = 'Lajos Santa',
    author_email = 'santa.lajos@coldline.hu',
    install_requires = [
        "Flask~=0.10",
        "transmissionrpc~=0.11",
        "lxml~=3.4",
        "SQLAlchemy~=1.0",
        "MySQL-python~=1.2",
        "phpserialize~=1.3",
        "voidpp-tools~=1.2",
        "cssselect~=1.0",
    ],
    include_package_data = True,
    packages = find_packages(),
)
