<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Project;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate the sitemap for the website';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // Ajouter la page d'accueil
        $sitemap->add(
            Url::create('/')
                ->setPriority(1.0)
                ->setChangeFrequency('daily')
        );

        // Ajouter les projets
        $projects = Project::where('type', 'project')->get();
        foreach ($projects as $project) {
            $sitemap->add(
                Url::create('/project/' . $project->slug . '/' . $project->id)
                    ->setPriority(0.9)
                    ->setChangeFrequency('weekly')
            );
        }

        // Ajouter les labs
        $labs = Project::where('type', 'lab')->get();
        foreach ($labs as $lab) {
            $sitemap->add(
                Url::create('/project/' . $lab->slug . '/' . $lab->id)
                    ->setPriority(0.8)
                    ->setChangeFrequency('weekly')
            );
        }

        // Enregistrer le sitemap
        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully.');
    }
}
