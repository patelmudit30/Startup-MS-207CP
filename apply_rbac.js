import fs from 'fs';
import path from 'path';

const basePath = `e:/BVM_B.Tech/Sem4/207CP/Project/StartupMS-main/StartupMS-main/src/pages`;

const files = [
    'StudentsPage.jsx',
    'StartupsPage.jsx',
    'TeamsPage.jsx',
    'FundsPage.jsx',
    'ExhibitionsPage.jsx',
    'EvaluationsPage.jsx',
    'DepartmentsPage.jsx',
    'InstructorsPage.jsx',
];

for (const fileName of files) {
    try {
        const filePath = path.join(basePath, fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`Not found: ${filePath}`);
            continue;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        if (!content.includes('useAuth')) {
            content = content.replace('export default function', 'import { useAuth } from "@/context/AuthContext";\n\nexport default function');
        }

        if (!content.includes('canModifyGeneral')) {
            content = content.replace(/export default function \w+\(\) {\n/, `$&  const { canModifyGeneral, canModifyStaff } = useAuth();\n`);
        }

        const canModifyVar = fileName === 'InstructorsPage.jsx' ? 'canModifyStaff' : 'canModifyGeneral';

        content = content.replace(/onAdd=\{openAdd\}/g, `onAdd={${canModifyVar} ? openAdd : null}`);
        content = content.replace(/onEdit=\{openEdit\}/g, `onEdit={${canModifyVar} ? openEdit : null}`);
        content = content.replace(/onDelete=\{handleDelete\}/g, `onDelete={${canModifyVar} ? handleDelete : null}`);

        fs.writeFileSync(filePath, content);
        console.log(`SUCCESS: ${fileName}`);
    } catch (e) {
        console.error(`ERROR in ${fileName}:`, e.message);
    }
}
