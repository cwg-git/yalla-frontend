import React from 'react';
import Categories from '../components/Categories';
const CategoriesPage = () => {

    return (
        <div>
            <div>
                <section className="inner-banner">
                    <div className="container">
                        <div className="text-block">
                            <h3><em>OUR</em></h3>
                            <h1><em>Categories</em></h1>
                        </div>
                    </div>
                </section>
               
            <Categories type="posts" />
            <Categories type="events" />
            <Categories type="maps" />
            </div>
        </div>
    );
};
export default CategoriesPage;
